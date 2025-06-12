import { useState, useRef, useEffect } from "react";

export default function EpubArea() {
    return (
        <div className="epub pl-5 border-2 bg-[var(--main-bg)] border-black">
            <input 
                type="file"
            />
            <button
                type="submit"
            />
        </div>
    )
}