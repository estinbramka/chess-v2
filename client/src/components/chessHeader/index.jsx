
export default function ChessHeader({ game }) {
    //console.log(game);
    function isConnected(color) {
        if (game[color]?.connected === true) {
            return (<div>connected</div>);
        } else if (game[color]?.connected === false) {
            return (<div>disconnected</div>);
        } else {
            return (<div>Unknown</div>);
        }
    }
    return (
        <div>
            <div>
                <div>
                    {
                        game.white ?
                            game.white.name :
                            'Unknown'
                    }
                </div>
                <div>(white)</div>
                {isConnected('white')}
            </div>
            <div>
                <div>
                    {
                        game.black ?
                            game.black.name :
                            'Unknown'
                    }
                </div>
                <div>(black)</div>
                {isConnected('black')}
            </div>
        </div>
    );
}