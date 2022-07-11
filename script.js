const c = (el) =>  document.querySelector(el) // função anonima
const cl = (element) => document.querySelectorAll(element) // função anonima
let modalQt = 1
let modalKey = 0
let cart = []



pizzaJson.map( (item, index) =>{

    let pizzaItem = c('.models .pizza-item').cloneNode(true)
    //preencher as infomações 
    pizzaItem.setAttribute('data-key', index)

    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`

    
    
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ 
        e.preventDefault(); // bloqueia a ação padrão
        c('.pizzaInfo--qt').innerHTML = modalQt
        let key = e.target.closest('.pizza-item').getAttribute('data-key')

        modalKey = key

        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo--actualPrice').innerHTML = ` R$ ${pizzaJson[key].price.toFixed(2)}`

        c(".pizzaInfo--size.selected").classList.remove('selected')

        cl('.pizzaInfo--size').forEach((size, sizeIndex)=>{  // FOREACH

            if(sizeIndex == 2){
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        c('.pizzaWindowArea').style.display = 'flex'

        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = '1'
        }, 200)
    
    })

    c('.pizza-area').append(pizzaItem)

} )

// EVENTOS DO MODAL

function closeModal(){
    c('.pizzaWindowArea').style.opacity = '0'

    setTimeout( ()=>{
        c('.pizzaWindowArea').style.display = 'none'
    }, 500)

    
}

cl('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
})


//BOTÕES DE SOMA E MENOS
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    modalQt--
   
    if(modalQt < 1){
        modalQt = 1
       
    }
    c('.pizzaInfo--qt').innerHTML = modalQt

})

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
 modalQt++

 c('.pizzaInfo--qt').innerHTML = modalQt
})

cl('.pizzaInfo--size').forEach(function(size, indexsize){
    size.addEventListener('click', ()=>{
       c('.pizzaInfo--size.selected').classList.remove('selected')
       size.classList.add('selected')
        
    })
})

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //Qual a pizza ?
  //  console.log('Pizza '+modalKey)
    //qual o tamanho ?
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key')
   // console.log('Tamanho: '+ size)
    //Quantas pizzas ?
   // console.log('Quantidade: ' + modalQt)

   let indetifier = pizzaJson[modalKey].id + '@' + size;

   let key = cart.findIndex((item) =>{
    return  item.indetifier == indetifier
})

if( key>-1 ){
    cart[key].qt += modalQt
}else{
    cart.push({
        indetifier,
        id: pizzaJson[modalKey].id,
        size,
        qt:modalQt
    })
}

    updateCart()
    closeModal()
})

//UPDATING THE CART 

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length>0){
        c('aside').style.left = '0'
    }
})

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'
})

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0){
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart){
            let pizzaItem = pizzaJson.find(item=>{
                return item.id == cart[i].id
            })

            subtotal += pizzaItem.price * cart[i].qt


            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSize 

            switch(cart[i].size){
                case '0':
                    pizzaSize  = 'P'
                break 
                case '1':
                    pizzaSize  = 'M'
                break
                case '2':
                    pizzaSize  = 'G'
                break
               
            }
            

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSize})`

            //mostrando quantidade de pizzas
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            //incrementando e decrementando quantidade de items
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
              
                if(cart[i].qt > 1){
                    cart[i].qt--
                    
                }else{
                    cart.splice(i, 1)
                   
                }
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
               
                    cart[i].qt++
                    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
                
                    updateCart()
            })

            


            c('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML= `R$ ${total.toFixed(2)}`

    }else{
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}



