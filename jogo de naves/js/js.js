const { LEFT } = require("phaser");

function start(){
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo'class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");


//principais variaveis do jogo

let somDisparo=document.getElementById("somDisparo");
let somExplosao=document.getElementById("somExplosao");
let musica=document.getElementById("musica");
let somGameover=document.getElementById("somGameover");
let somPerdido=document.getElementById("somPerdido");
let somResgate=document.getElementById("somResgate");
let jogo ={};
let fimdejogo= false
let pontos=0;
let salvos=0;
let perdidos=0;
let energiaAtual=3;
let posicaoY= parseInt(Math.random()*334);
let velocidade=5;
let podeAtirar =true
let TECLA={
    w:87,
    s:83,
    d:68
};
jogo.pressionou=[];
//Música em loop
musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
musica.play();


//verifica se o usuario pessionou alguma tecla

$(document).keydown(function(e){
    jogo.pressionou[e.which]=true;
});
$(document).keyup(function(e){
    jogo.pressionou[e.which]=false
});

//loop do game 
jogo.timer=setInterval(loop,30);



function loop(){
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();
}
//função que movimenta o fundo 
function movefundo(){
    esquerda = parseInt($("#fundoGame").css("background-position"));// aqui mostra a posição atual
    $("#fundoGame").css("background-position",esquerda-1);// aqui faz com que a imagem ande 1 pixel para esquerda

}

//função que move o jogador

function movejogador(){
    if(jogo.pressionou[TECLA.w]){
        let topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top",topo-10);// subtrai 10 ao top para subir a nave

        
         // limita o Helicóptero dentro da tela
           if(topo<=0){
               $("#jogador").css("top",topo+10);
           }
    }
    else if(jogo.pressionou[TECLA.s]){
        let topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top",topo+10);  // soma 10 a top para descer a nave

         // limita o Helicóptero dentro da tela
            if(topo>=434){
                $("#jogador").css("top",topo -10);
            }
    }
    else if(jogo.pressionou[TECLA.d]){
        // chama a função disparo
           
        disparo();
    
    }


    
}

// função que movimento o helicoptero inimigo

function moveinimigo1(){
    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX-velocidade);
    $("#inimigo1").css("top",posicaoY);
       
      if(posicaoX<=0){
          posicaoY= parseInt(Math.random()*334);
          $("#inimigo1").css("left",694);
          $("#inimigo1").css("top",posicaoY);
      }
}

//função que move o caminhão do inimigo

function moveinimigo2(){
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left",posicaoX-3)
        if(posicaoX<=0){
            $("#inimigo2").css("left",775);

        }
}

//função que move o amigo

function moveamigo(){
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX+1);
    if(posicaoX >906){
        $("#amigo").css("left",0);
    }
}


//executa disparo

function disparo(){
    if(podeAtirar===true){
        somDisparo.play();
        podeAtirar=false;
        
        topo = parseInt($("#jogador").css("top"))
        posicaoX=parseInt($("#jogador").css("left"))
        tiroX=posicaoX+190;
        topoTiro=topo+50;
        $("#fundoGame").append("<div id='disparo'></div>");
        $("#disparo").css("left",tiroX);
        $("#disparo").css("top",topoTiro)

        let tempoDisparo=window.setInterval(executaDisparo,30);

    
    //pode Atirar
       function executaDisparo(){
           posicaoX = parseInt($("#disparo").css("left"));//pega a posição atual do disparo
           $("#disparo").css("left",posicaoX+15); // faz o disparo caminhar
              
                 if(posicaoX>900){
                     window.clearInterval(tempoDisparo); // limpa o tempo de disparo
                     tempoDisparo=null; // alguns browsers precisam que o tempo de disparo receba o valor null
                     $("#disparo").remove(); //remove o disparo da tela
                     podeAtirar=true;
                 }
       }
    }

}

//função de colisão
function colisao() {
    let colisao1 = ($("#jogador").collision($("#inimigo1")));
    let colisao2 = ($("#jogador").collision($("#inimigo2")));
    let colisao3 = ($("#disparo").collision($("#inimigo1")));
    let colisao4 = ($("#disparo").collision($("#inimigo2")));
    let colisao5 = ($("#jogador").collision($("#amigo")));
    let colisao6 = ($("#inimigo2").collision($("#amigo")));
    // jogador com o inimigo1
        
        if (colisao1.length>0) {
            energiaAtual--;
        inimigo1X = parseInt($("#inimigo1").css("left"));
        inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X,inimigo1Y);
    
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left",694);
        $("#inimigo1").css("top",posicaoY);
        }
        //jogador com inimigo 2
        else if(colisao2.length>0){

            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2 (inimigo2X,inimigo2Y);

            $("#inimigo2").remove();
            reposicionaInimigo2();
        }
        //disparo com inimigo 1
        else if(colisao3.length>0){
            velocidade=velocidade+0.3;
            pontos=pontos+100;

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }
        
        //disparo com inimigo 2
        
        else if(colisao4.length>0) {

            velocidade=velocidade+0.3;
            pontos=pontos+50

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            
            explosao2 (inimigo2X,inimigo2Y);

            $("#disparo").css("left",950);
            $("#inimigo2").remove();
            reposicionaInimigo2();
        }
        
        //jogador com o amigo
        
        else if(colisao5.length>0){
            somResgate.play();
            salvos ++;
            reposicionaAmigo();
            $("#amigo").remove();
        }
        
        //colisão amigo com inimigo2
        
        else if(colisao6.length>0){

            perdidos++;
            amigoX=parseInt($("#amigo").css("left"));
            amigoY=parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY)
            $("#amigo").remove();

            reposicionaAmigo();


        }
    
    }

//função de explosão
    function explosao1(inimigo1X , inimigo1Y) {

        somExplosao.play();
	    $("#fundoGame").append("<div id='explosao1'></div");
      
	    let div=$("#explosao1");
	    div.css("top", inimigo1Y);
	    div.css("left", inimigo1X);
	    div.animate({width:200, opacity:0}, "slow");
	
	    let tempoExplosao=window.setInterval(removeExplosao, 1000);
	
		function removeExplosao() {
			
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
			
		}
		
	}

    function reposicionaInimigo2(){
        let tempoColisao4=window.setInterval(reposiciona4,5000);
             function reposiciona4(){
                 window.clearInterval(tempoColisao4);
                 tempoColisao4=null;
                   if(fimdejogo===false){
                       $("#fundoGame").append("<div id='inimigo2'></div>");

                   }
             }
    }

    function explosao2(inimigo2X , inimigo2Y) {

        somExplosao.play();
	    $("#fundoGame").append("<div id='explosao2'></div");
      
	    let div2=$("#explosao2");
	    div2.css("top", inimigo2Y);
	    div2.css("left", inimigo2X);
	    div2.animate({width:200, opacity:0}, "slow");
	
	    let tempoExplosao2=window.setInterval(removeExplosao2, 1000);
	
		function removeExplosao2() {
			
			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2=null;
			
		}
		
	}
    function reposicionaAmigo(){
        let tempoAmigo=window.setInterval(reposiciona6,6000);
             function reposiciona6(){
                 window.clearInterval(tempoAmigo);
                 tempoAmigo=null;

                 if(fimdejogo===false) {
                     $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
                 }
             }
    }

    function explosao3(amigoX,amigoY){

        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        let tempoExplosao3=window.setInterval(resetaExplosao3,1000);
        function resetaExplosao3(){
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3)
            tempoExplosao3=null;

        }
    }

    //Placar

    function placar (){ 

        $("#placar").html("<h2>Pontos:" + pontos + " Salvos: "+salvos+" Perdidos: "+perdidos+"</h2> ")

    }

    
    function energia() {
	
        if (energiaAtual==3) {
        
            $("#energia").css("background-image", "url(../JogosHTML5/jogo1/imgs/energia3.png)");
        }

        if (energiaAtual==2) {
        
            $("#energia").css("background-image", "url(../JogosHTML5/jogo1/imgs/energia2.png)");
        }

        if (energiaAtual==1) {
        
            $("#energia").css("background-image", "url(../JogosHTML5/jogo1/imgs/energia1.png)");
        }   

        if (energiaAtual==0) {
        
            $("#energia").css("background-image", "url(../JogosHTML5/jogo1/imgs/energia0.png)");
        
        //Game Over
        gameOver();
    }

}
//FunÇão GAME OVER
	function gameOver() {
	fimdejogo=true;
	musica.pause();
	somGameover.play();
	
	window.clearInterval(jogo.timer);
	jogo.timer=null;
	
	$("#jogador").remove();
	$("#inimigo1").remove();
	$("#inimigo2").remove();
	$("#amigo").remove();
	
	$("#fundoGame").append("<div id='fim'></div>");
	
	$("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
	} // Fim da função gameOver;

 
}
//reiniciajogo
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
}


