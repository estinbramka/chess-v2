import { useState } from "react";
import "./promotion-styles.css"

export default function Promotion() {
    const [color, setColor] = useState('black');
    return (
        <div className="overlay hidden">
            <div className="promotion-select">
                {color === 'black' &&
                    <>
                        <div className="promotion-piece br"></div>
                        <div className="promotion-piece bn"></div>
                        <div className="promotion-piece bb"></div>
                        <div className="promotion-piece bq"></div>
                    </>
                }
                {color === 'white' &&
                    <>
                        <div className="promotion-piece wr"></div>
                        <div className="promotion-piece wn"></div>
                        <div className="promotion-piece wb"></div>
                        <div className="promotion-piece wq"></div>
                    </>
                }
            </div>
        </div>
    );
}