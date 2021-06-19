async function setup(){
    alert("start");
    $.ajax({
        type:"GET",
        url: "/api",
        //dataType: "json"
    }).done((res)=>{
        console.log(res);
    })
    await axios.get('/api').then((res)=>{console.log(res.data)});
}
window.addEventListener('load',setup,false);
alert("start");
console.log("test");