function setup(){
    alert("start");
    $.ajax({
        type:"GET",
        url: "api",
        dataType: "json"
    }).success((res)=>{
        alert(res);
    })
}
window.addEventListener('load',setup,false);