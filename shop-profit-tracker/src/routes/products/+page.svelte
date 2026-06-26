<script>
  let { data, form } = $props();
  let editingId = null;
</script>

<div class="container">
  <h1>Products</h1>

  <!-- Add Product Form -->
  <form method="POST" action="?/add" class="add-form">
    <fieldset>
      <legend>Add New Product</legend>
      {#if form?.error && !editingId}
        <p class="error">{form.error}</p>
      {/if}
      {#if form?.success && !editingId}
        <p class="success">Product added!</p>
      {/if}
      <label>
        Product Name
        <input name="name" type="text" required placeholder="e.g. Cement Bag" />
      </label>
      <label>
        Selling Price ($)
        <input name="selling_price" type="number" step="0.01" min="0" required placeholder="0.00" />
      </label>
      <label>
        Cost Price ($)
        <input name="cost_price" type="number" step="0.01" min="0" required placeholder="0.00" />
      </label>
      <button type="submit">Add Product</button>
    </fieldset>
  </form>

  <!-- Product List -->
  <h2>Current Products ({data.products.length})</h2>
  {#if data.products.length === 0}
    <p>No products yet. Start by adding one above.</p>
  {:else}
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Selling</th>
            <th>Cost</th>
            <th>Profit/Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each data.products as product}
            <tr>
              {#if editingId === product.id}
                <!-- INLINE EDIT MODE -->
                <td colspan="5">
                  <form method="POST" action="?/update" style="display:contents;">
                    <input type="hidden" name="id" value={product.id} />
                    <div class="edit-row">
                      <input name="name" value={product.name} required />
                      <input name="selling_price" type="number" step="0.01" min="0" value={product.selling_price} required />
                      <input name="cost_price" type="number" step="0.01" min="0" value={product.cost_price} required />
                      <span>${(product.selling_price - product.cost_price).toFixed(2)}</span>
                      <button type="submit">Save</button>
                      <button type="button" onclick={() => editingId = null}>Cancel</button>
                    </div>
                  </form>
                </td>
              {:else}
                <!-- DISPLAY MODE -->
                <td>{product.name}</td>
                <td>${product.selling_price.toFixed(2)}</td>
                <td>${product.cost_price.toFixed(2)}</td>
                <td>${product.profit_per_unit.toFixed(2)}</td>
                <td>
                  <button onclick={() => editingId = product.id}>Edit</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if form?.error && editingId}
    <p class="error" style="margin-top:1rem">{form.error}</p>
  {/if}
  {#if form?.success && editingId}
    <p class="success" style="margin-top:1rem">{form.updated} updated!</p>
  {/if}
</div>

<style>
  .container {
    max-width: 700px;
    margin: 0 auto;
    padding: 1rem;
  }
  h1 { margin-bottom: 1rem; }
  .add-form { margin-bottom: 2rem; }
  fieldset {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  legend { font-weight: bold; }
  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    gap: 0.25rem;
  }
  input {
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
  }
  button {
    padding: 0.4rem 0.8rem;
    background: #0070f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin: 0 0.2rem;
  }
  button:hover { background: #0050b0; }
  .error { color: #d00; background: #fdd; padding: 0.5rem; border-radius: 4px; }
  .success { color: #0a0; background: #dfd; padding: 0.5rem; border-radius: 4px; }
  .table-wrapper { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #ddd; }
  th { background: #f5f5f5; }
  .edit-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .edit-row input { width: auto; flex: 1; min-width: 80px; }
</style>