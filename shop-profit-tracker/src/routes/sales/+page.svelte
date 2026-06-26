<script>
  let { data, form } = $props();
</script>

<div class="container">
  <h1>Record Sale</h1>

  <form method="POST" action="?/record" class="sale-form">
    <fieldset>
      <legend>New Sale</legend>

      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}
      {#if form?.success}
        <p class="success">Sale recorded!</p>
      {/if}

      <label>
        Product
        <select name="product_id" required>
          <option value="">-- Choose a product --</option>
          {#each data.products as product}
            <option value={product.id}>
              {product.name} (${product.selling_price.toFixed(2)})
            </option>
          {/each}
        </select>
      </label>

      <label>
        Quantity
        <input name="quantity" type="number" min="1" value="1" />
      </label>

      <button type="submit">➕ Record Sale</button>
    </fieldset>
  </form>

  <h2>Today's Sales</h2>
  {#if data.todaySales.length === 0}
    <p>No sales recorded today.</p>
  {:else}
    <p>Total profit today: <strong>${data.todayTotalProfit.toFixed(2)}</strong></p>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {#each data.todaySales as sale}
            <tr>
              <td>{sale.sale_time}</td>
              <td>{sale.name}</td>
              <td>{sale.quantity}</td>
              <td>${sale.selling_price_at_time.toFixed(2)}</td>
              <td>${sale.total_profit.toFixed(2)}</td>
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
  .sale-form { margin-bottom: 2rem; }
  fieldset {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  legend { font-weight: bold; }
  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    gap: 0.25rem;
  }
  select, input {
    padding: 0.7rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
  }
  button {
    padding: 0.8rem;
    background: #0070f3;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
  }
  button:hover { background: #0050b0; }
  .error { color: #d00; background: #fdd; padding: 0.5rem; border-radius: 4px; }
  .success { color: #0a0; background: #dfd; padding: 0.5rem; border-radius: 4px; }
  .table-wrapper { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: left; }
  th { background: #f5f5f5; }
</style>