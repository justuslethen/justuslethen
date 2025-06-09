import React from "react";

const Selection = ({ header, className, type, selections, selected, setSelected }) => {
    return (
        <div className={`selection ${type === "color" ? "colorSelection" : ""}`}>
            <p>{header}</p>
            <div className={className} value={selected} onChange={(e) => setSelected(parseInt(e.target.value))}>
                {selections.map((option, index) => (
                    <div className="option"
                        key={index} 
                        value={index} 
                        chosen={index === selected ? "true" : undefined}
                        onClick={() => setSelected(index)}>
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Selection;