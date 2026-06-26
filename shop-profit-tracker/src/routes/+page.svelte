<script>
  let { data } = $props();
</script>

<h1>Shop Profit Tracker</h1>

<p style="text-align:center; font-size:1.2rem;">
  Today's profit: <strong>${data.todayTotalProfit.toFixed(2)}</strong>
</p>

<nav style="text-align:center; margin-top:2rem;">
  <a href="/products">Manage Products</a>
  <span style="margin:0 1rem;">|</span>
  <a href="/sales">Record Sales</a>
  <span style="margin:0 1rem;">|</span>
  <a href="/reports">Monthly Reports</a>
</nav>

<style>
  h1 { text-align: center; margin-top: 2rem; }
  a { color: #0070f3; text-decoration: none; font-weight: bold; }
</style>