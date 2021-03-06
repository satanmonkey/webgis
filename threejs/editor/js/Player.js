/**
 * @author mrdoob / http://mrdoob.com/
 */

var Player = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'player' );
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );


	var player = new APP.Player();

	window.addEventListener( 'resize', function () {

		if ( player.dom === undefined ) return;
		
		player.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

	} );

	signals.startPlayer.add( function () {

		container.setDisplay( '' );

		player.load( editor.toJSON() );
		player.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		player.play();
		container.dom.appendChild( player.dom );
	} );

	signals.stopPlayer.add( function () {

		container.setDisplay( 'none' );
		player.stop();
		if(player.dom)
		{
			container.dom.removeChild( player.dom );
		}
	} );
	
	this.player = player;

	return container;

};

//Player.prototype = {
	//getPlayer:function(){
		//return this.player;
	//}
//}
