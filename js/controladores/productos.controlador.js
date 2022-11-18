
const carrito=[];

let app = angular.module("mi-app",['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl: "templates/home.html",
        controller:"controller"
    })
    .when("/catalogo-productos",{
        templateUrl: "templates/catalogo-productos.html",
        controller:"controller"
    })
    .when("/detalle-producto/:id",{
        templateUrl:"templates/producto-detalles.html",
        controller:"controller"
    })
    .when("/pagos",{
        templateUrl:"templates/pagos.html",
        controller:"controller"
    })
    .otherwise("/");
});
app.controller("controller",function($scope,$routeParams,$http){
    let idCart = 1;
    $scope.carrito=carrito;
    // $scope.productos
    $http.get('catalogo-productos.json').then(function(response){
        $scope.productos = response.data;
        $scope.detalleProducto = $scope.productos.find(obj=>{
            return obj.id == $routeParams.id;
        });
    });

    $scope.getProductCategory= function(category){
        if(category){
            return $scope.productos.filter(obj=>{
                return obj.category == category;
            });
        }else{
            return $scope.productos;
        }
    }
    
    $scope.addToCart = function(id){
        let amount = 1;
        let itemCart = $scope.carrito.find(itemCart=>{return itemCart.idProducto == id;});
        let itemCartExists = itemCart != undefined ? true: false;
        
        if(!itemCartExists){
            let producto = $scope.productos.find(obj=>{
                return obj.id == id;
            });
            $scope.carrito.push({id:idCart,idProducto:producto.id,name: producto.name,image:producto.image,price:producto.price,amount:amount,total:producto.price*amount})
            idCart++;
        }else{
            $scope.increaseAmount(itemCart.id);
        }
    }
    
    $scope.getTotalAmountCarrito = function(){
        let totalAmount = $scope.carrito.reduce((acc,itemCart)=>{
            return acc + itemCart.amount;
        },0);
        return totalAmount;
    }
    
    $scope.getTotalPriceCarrito = function(){
        let total = 0;
        $scope.carrito.forEach(product =>{
            total += parseFloat(product.total);
        });
        return total.toFixed(2);
    }
    
    $scope.removeItemCart = function(id){
        let itemCart = $scope.carrito.find(obj=>{
            return obj.id == id;
        });
        let indexItem = $scope.carrito.indexOf(itemCart);
        $scope.carrito.splice(indexItem,1);
        $scope.getTotalAmountCarrito();
    }
    
    $scope.removeCart = function(){
        $scope.carrito.splice(0,);
        $scope.getTotalAmountCarrito();
    }
    
    $scope.increaseAmount = function(id){
        let itemCart = $scope.carrito.find(obj=>{
            return obj.id == id;
        });
        itemCart.amount++;
        itemCart.total = (itemCart.amount*itemCart.price).toFixed(2);
    }
    
    $scope.decreaseAmount = function(id){
        let itemCart = $scope.carrito.find(obj=>{
            return obj.id == id;
        });
        if(itemCart.amount>1){
            itemCart.amount--;
            itemCart.total = (itemCart.amount * itemCart.price).toFixed(2);
        }else{
            $scope.removeItemCart(id);
        }
    }
    

    //Efectos CSS
    const carritoDOM = document.querySelector(".carrito");
    const openCarrito = document.querySelector(".carrito__icon");
    const closeCarrito = document.querySelector(".close__carrito");
    const overlay = document.querySelector(".carrito__overlay");
    start=function(){
        openCarrito.addEventListener("click", ()=>{
            carritoDOM.classList.add("show");
            overlay.classList.add("show");
        });
        closeCarrito.addEventListener("click", ()=>{
            carritoDOM.classList.remove("show");
            overlay.classList.remove("show");
        });
    }
    start()
    $scope.show = ()=>{
        carritoDOM.classList.add("show");
        overlay.classList.add("show");
    };
    $scope.hidden=()=>{
        carritoDOM.classList.remove("show");
        overlay.classList.remove("show");
    };
});