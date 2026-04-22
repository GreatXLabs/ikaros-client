

export function Infoshow({ label, subtitle, content }) {
    return (
            <>
            <style>
                {`
                    .info-item{
                        display:flex;
                        flex-direction:column;
                        gap:0;
                        width:fit-content;
                    }
                   .label {
                        font-size:16px;
                        font-weight:bolder;
                    }
                    .sublabel {
                        font-size:12px;
                        color:rgba(255, 255, 255, 0.6);
                        
                    }
                    .info-item p{
                        padding:5px;
                        background-color: rgba(88, 88, 88, 0.2);
                        font-size:14px;
                    
                        border-radius:5px;
                    }

                `}
            </style>
            
            <div className="info-item">
                <span className="label">{label}</span>
                <span className="sublabel">{subtitle}</span>
                <p>{content}</p>
            </div>
            
            

        </>
            
    )
}

