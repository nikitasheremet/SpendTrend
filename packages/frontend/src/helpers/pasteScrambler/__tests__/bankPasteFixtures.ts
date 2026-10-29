// Bank-shaped Add Data Pastes built from the rows in the bankInfoFormatting tests.

export const DEBIT_CREDIT_TABLE_PASTE = `<html><body><!--StartFragment-->
<table class="transactions" aria-label="Chequing account 1234-5678">
  <tbody>
    <tr data-id="txn-1"><td>Jan 15, 2026</td><td title="Grocery Store #4471">Grocery Store</td><td>$50.00</td><td></td><td>$1,234.56</td></tr>
    <tr><td>Jan 16, 2026</td><td>Salary</td><td></td><td>2500.00</td><td>3,734.56</td></tr>
    <tr><td>Jan 17, 2026</td><td>Coffee Shop</td><td>$6.32$0.03</td><td></td><td></td></tr>
    <tr><td colspan="5"></td></tr>
  </tbody>
</table>
<!--EndFragment--></body></html>`

export const NOT_APPLICABLE_PASTE = `<table>
  <tr><td>Jan 15, 2026</td><td>Coffee Shop</td><td>Not applicable</td><td>$15.50</td><td></td></tr>
  <tr><td>Jan 18, 2026</td><td></td><td>Local</td><td></td><td>Grocery</td><td>Store</td><td>−$75.00</td></tr>
</table>`

export const PERCENTAGE_PASTE = `<table>
  <tr>
    <td>Feb 2, 2026</td>
    <td rowspan="2"><a href="https://bank.example/txn/9981">0.5%TIM HORTONS #1723 TORONTO ONFast Food (Quick Service)open dialog</a></td>
    <td></td>
    <td></td>
  </tr>
</table>`

export const TYPICAL_BANK_PASTES = [
  ['debit and credit columns', DEBIT_CREDIT_TABLE_PASTE],
  ['a Not applicable column', NOT_APPLICABLE_PASTE],
  ['a percentage in the description', PERCENTAGE_PASTE],
] as const
