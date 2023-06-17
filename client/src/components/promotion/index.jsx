import { useEffect, useRef } from "react";
import "./promotion-styles.css"

export default function Promotion({ promotionHidden, setPromotionPromise, promotionColor }) {
    const resolveOut = useRef();
    useEffect(() => {
        setPromotionPromise(new Promise((resolve, reject) => {
            resolveOut.current = resolve;
        }))
    }, [setPromotionPromise])

    function promotionClick(promotion) {
        //console.log(resolveOut)
        resolveOut.current(promotion);
        setPromotionPromise(new Promise((resolve, reject) => {
            resolveOut.current = resolve;
        }))
    }

    return (
        <div className={promotionHidden ? "overlay hidden" : "overlay"}>
            <div className="promotion-select">
                {promotionColor === 'black' &&
                    <>
                        <div className="promotion-piece br" onClick={() => promotionClick('r')}></div>
                        <div className="promotion-piece bn" onClick={() => promotionClick('n')}></div>
                        <div className="promotion-piece bb" onClick={() => promotionClick('b')}></div>
                        <div className="promotion-piece bq" onClick={() => promotionClick('q')}></div>
                    </>
                }
                {promotionColor === 'white' &&
                    <>
                        <div className="promotion-piece wr" onClick={() => promotionClick('r')}></div>
                        <div className="promotion-piece wn" onClick={() => promotionClick('n')}></div>
                        <div className="promotion-piece wb" onClick={() => promotionClick('b')}></div>
                        <div className="promotion-piece wq" onClick={() => promotionClick('q')}></div>
                    </>
                }
            </div>
        </div>
    );
}