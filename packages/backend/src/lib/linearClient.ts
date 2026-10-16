const LINEAR_GRAPHQL_URL = 'https://api.linear.app/graphql'
const SPENDTREND_TEAM_KEY = 'SPE'
const BACKLOG_STATE_NAME = 'Backlog'

export interface CreateLinearIssueInput {
  apiKey: string
  title: string
  description: string
  labelNames: string[]
}

export interface CreatedLinearIssue {
  identifier: string
}

// Files an issue in the SpendTrend team's Backlog (or its default status if there's no Backlog),
// assigned to the owner of the API key.
export async function createLinearIssue({
  apiKey,
  title,
  description,
  labelNames,
}: CreateLinearIssueInput): Promise<CreatedLinearIssue> {
  const { teamId, backlogStateId, viewerId } = await fetchTeamDetails(apiKey)
  const labelIds = await fetchLabelIds(apiKey, teamId, labelNames)

  const data = await linearRequest<{
    issueCreate: { success: boolean; issue: { identifier: string } | null }
  }>(
    apiKey,
    `mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { identifier } }
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

  return { identifier: data.issueCreate.issue.identifier }
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
