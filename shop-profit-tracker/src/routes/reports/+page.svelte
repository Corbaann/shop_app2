<script>
  let { data } = $props();
</script>

<div class="container">
  <h1>Monthly Reports</h1>

  <form method="GET" class="month-selector">
    <label>
      Select Month
      <select name="month" onchange={(e) => e.target.form.submit()}>
  {#each data.availableMonths as m}
    <option value={m} selected={m === data.month}>{m}</option>
  {/each}
  {#if !data.availableMonths.includes(data.month)}
    <option value={data.month} selected>{data.month}</option>
  {/if}
</select>

    </label>
    <noscript>
      <button type="submit">Go</button>
    </noscript>
  </form>

  <div class="summary">
    <p>Total Sales: <strong>{data.summary.total_sales}</strong></p>
    <p>Total Revenue: <strong>${data.summary.total_revenue.toFixed(2)}</strong></p>
    <p>Total Profit: <strong>${data.summary.total_profit.toFixed(2)}</strong></p>
  </div>

  <h2>Breakdown by Product</h2>
  {#if data.items.length === 0}
    <p>No sales recorded for this month.</p>
  {:else}
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty Sold</th>
            <th>Revenue</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {#each data.items as item}
            <tr>
              <td>{item.name}</td>
              <td>{item.quantity_sold}</td>
              <td>${item.revenue.toFixed(2)}</td>
              <td>${item.profit.toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }
  h1 { margin-bottom: 1rem; }
  .month-selector {
    margin-bottom: 1.5rem;
  }
  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    gap: 0.25rem;
  }
  select {
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
  }
  .summary {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
  }
  .summary p {
    margin: 0.3rem 0;
  }
  .table-wrapper { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: left; }
  th { background: #f5f5f5; }
</style>