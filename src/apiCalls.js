export let fetchData = (data) =>  {
  return fetch(`http://localhost:3001/api/v1/${data}`)
    .then(rsp => rsp.json() )
    .catch(error => console.log(error));
}
