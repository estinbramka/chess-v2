import './chessHeader-styles.css'

export default function ChessHeader({ game }) {
    //console.log(game);
    function isConnected(color) {
        if (game[color]?.connected === true) {
            return (<div>Connected</div>);
        } else if (game[color]?.connected === false) {
            return (<div>Disconnected</div>);
        } else {
            return (<div>Disconnected</div>);
        }
    }
    return (
        <div className='players-header'>
            <div className='player-status'>
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
            VS
            <div className='player-status'>
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