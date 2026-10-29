const LINEAR_GRAPHQL_URL = 'https://api.linear.app/graphql'
const SPENDTREND_TEAM_KEY = 'SPE'
const BACKLOG_STATE_NAME = 'Backlog'
// Linear's own uploader sends this alongside the headers fileUpload returns.
const UPLOAD_CACHE_CONTROL = 'public, max-age=31536000'

export interface CreateLinearIssueInput {
  apiKey: string
  title: string
  description: string
  labelNames: string[]
  attachments: LinearAttachmentFile[]
}

export interface LinearAttachmentFile {
  filename: string
  contentType: string
  content: string
}

export interface CreatedLinearIssue {
  identifier: string
}

// Files an issue in the SpendTrend team's Backlog (or its default status if there's no Backlog),
// assigned to the owner of the API key, with the files attached. Files are uploaded before
// the issue exists, and an issue whose attachments fail is deleted, so it's all or nothing.
export async function createLinearIssue({
  apiKey,
  title,
  description,
  labelNames,
  attachments,
}: CreateLinearIssueInput): Promise<CreatedLinearIssue> {
  const { teamId, backlogStateId, viewerId } = await fetchTeamDetails(apiKey)
  const labelIds = await fetchLabelIds(apiKey, teamId, labelNames)
  const uploadedFiles = await Promise.all(
    attachments.map(async (file) => ({
      filename: file.filename,
      assetUrl: await uploadFile(apiKey, file),
    })),
  )

  const data = await linearRequest<{
    issueCreate: { success: boolean; issue: { id: string; identifier: string } | null }
  }>(
    apiKey,
    `mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { id identifier } }
    }`,
    {
      input: {
        teamId,
        ...(backlogStateId && { stateId: backlogStateId }),
        assigneeId: viewerId,
        labelIds,
        title,
        description,
      },
    },
  )

  if (!data.issueCreate.success || !data.issueCreate.issue) {
    throw new Error('Linear did not create the issue')
  }

  const { id: issueId, identifier } = data.issueCreate.issue
  try {
    for (const uploadedFile of uploadedFiles) {
      await attachFile(apiKey, issueId, uploadedFile)
    }
  } catch (error) {
    await deleteIssue(apiKey, issueId)
    throw error
  }

  return { identifier }
}

async function fetchTeamDetails(
  apiKey: string,
): Promise<{ teamId: string; backlogStateId: string | undefined; viewerId: string }> {
  const data = await linearRequest<{
    viewer: { id: string }
    teams: { nodes: Array<{ id: string; states: { nodes: Array<{ id: string; name: string }> } }> }
  }>(
    apiKey,
    `query TeamDetails($teamKey: String!) {
      viewer { id }
      teams(filter: { key: { eq: $teamKey } }) {
        nodes { id states { nodes { id name } } }
      }
    }`,
    { teamKey: SPENDTREND_TEAM_KEY },
  )

  const team = data.teams.nodes[0]
  if (!team) {
    throw new Error(`Linear team ${SPENDTREND_TEAM_KEY} not found`)
  }

  // Without a Backlog state, issueCreate falls back to the team's default status.
  const backlogState = team.states.nodes.find((state) => state.name === BACKLOG_STATE_NAME)

  return { teamId: team.id, backlogStateId: backlogState?.id, viewerId: data.viewer.id }
}

// Labels can belong to the team or to the whole workspace.
async function fetchLabelIds(
  apiKey: string,
  teamId: string,
  labelNames: string[],
): Promise<string[]> {
  const data = await linearRequest<{
    issueLabels: { nodes: Array<{ id: string; name: string; team: { id: string } | null }> }
  }>(
    apiKey,
    `query Labels($names: [String!]) {
      issueLabels(filter: { name: { in: $names } }) { nodes { id name team { id } } }
    }`,
    { names: labelNames },
  )

  return labelNames.map((labelName) => {
    const label = data.issueLabels.nodes.find(
      (node) => node.name === labelName && (node.team === null || node.team.id === teamId),
    )
    if (!label) {
      throw new Error(`Linear label ${labelName} not found`)
    }
    return label.id
  })
}

// Asks Linear for a signed upload URL, then PUTs the file there. Returns the file's Linear URL.
async function uploadFile(
  apiKey: string,
  { filename, contentType, content }: LinearAttachmentFile,
): Promise<string> {
  const body = Buffer.from(content, 'utf8')
  const data = await linearRequest<{
    fileUpload: {
      success: boolean
      uploadFile: {
        uploadUrl: string
        assetUrl: string
        headers: Array<{ key: string; value: string }>
      } | null
    }
  }>(
    apiKey,
    `mutation FileUpload($contentType: String!, $filename: String!, $size: Int!) {
      fileUpload(contentType: $contentType, filename: $filename, size: $size) {
        success
        uploadFile { uploadUrl assetUrl headers { key value } }
      }
    }`,
    { contentType, filename, size: body.byteLength },
  )

  const signedUpload = data.fileUpload.uploadFile
  if (!data.fileUpload.success || !signedUpload) {
    throw new Error(`Linear did not accept the upload of ${filename}`)
  }

  const response = await fetch(signedUpload.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Cache-Control': UPLOAD_CACHE_CONTROL,
      ...Object.fromEntries(signedUpload.headers.map(({ key, value }) => [key, value])),
    },
    body,
  })
  if (!response.ok) {
    throw new Error(`Linear upload of ${filename} failed (${response.status})`)
  }

  return signedUpload.assetUrl
}

async function attachFile(
  apiKey: string,
  issueId: string,
  { filename, assetUrl }: { filename: string; assetUrl: string },
): Promise<void> {
  const data = await linearRequest<{ attachmentCreate: { success: boolean } }>(
    apiKey,
    `mutation AttachFile($input: AttachmentCreateInput!) {
      attachmentCreate(input: $input) { success }
    }`,
    { input: { issueId, url: assetUrl, title: filename } },
  )

  if (!data.attachmentCreate.success) {
    throw new Error(`Linear did not attach ${filename}`)
  }
}

// Best effort: the attachment error is the one worth reporting, not a failed cleanup.
async function deleteIssue(apiKey: string, issueId: string): Promise<void> {
  try {
    await linearRequest(
      apiKey,
      `mutation DeleteIssue($id: String!) { issueDelete(id: $id) { success } }`,
      { id: issueId },
    )
  } catch (error) {
    console.error(`Could not delete half-attached Linear issue ${issueId}`, error)
  }
}

async function linearRequest<T>(
  apiKey: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(LINEAR_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: apiKey },
    body: JSON.stringify({ query, variables }),
  })

  const body = (await response.json()) as { data?: T; errors?: Array<{ message: string }> }
  if (!response.ok || body.errors?.length || !body.data) {
    const errorMessages = body.errors?.map((error) => error.message).join('; ')
    throw new Error(`Linear request failed (${response.status}): ${errorMessages ?? 'no data'}`)
  }

  return body.data
}
