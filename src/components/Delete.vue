<script setup>

</script>

<template>
  <div class="container">
    <h1>List of Vns</h1>
    <table class="styled-table">
      <thead>
        <tr>
          <th>virtualNetworkId</th>
          <th>virtualNetworkName</th>
          <th>CreationDate</th>
          <th>UpdatedDate</th> 
          <th>MaxBandwith</th>
          <th>NumberOfNodes</th>   
          <th>NumberofLinks</th>   
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="item in data" :key="item.virtualNetworkId"> -->
          <tr>
            <td>1</td>
            <td>OnosVn</td>
            <td>2023-01-2</td>
            <td>2023-01-4</td>
            <td>1000</td>
            <td>3</td>
            <td>2</td>
            <td><button class="button-40">Delete</button></td>
          </tr>
        <!-- </tr> -->
      </tbody>
    </table>
  </div>

</template>

<style scoped lang="scss">
h1 {
  text-align: center;
  margin: 2%;
  padding: 0%;
  left: 0%;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2%;
  padding: 0%;
}

.bloc {
	display: flex;
  flex-direction: row;
  justify-content: start;
	main {
		flex: 1 1 0;
		padding: 2rem;
		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}

.styled-table {
  border-collapse: collapse;
  margin: 5% 2% 1% 3%;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}
.styled-table thead tr {
  background-color: #1e293b;
  color: #ffffff;
  text-align: left;
  font-weight: bold;
}
.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}
.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #22c55e;
}

.button-40 {
  background-color: #22c55e;
  border: 1px solid transparent;
  border-radius: .75rem;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  flex: 0 0 auto;
  font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5rem;
  padding: .75rem 1.2rem;
  text-align: center;
  text-decoration: none #6B7280 solid;
  text-decoration-thickness: auto;
  transition-duration: .2s;
  transition-property: background-color,border-color,color,fill,stroke;
  transition-timing-function: cubic-bezier(.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
  margin: 1%;
}

.button-40:hover {
  background-color: #374151;
}

.button-40:focus {
  box-shadow: none;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

@media (min-width: 768px) {
  .button-40 {
    padding: .6rem .6rem;
  }
}
</style>