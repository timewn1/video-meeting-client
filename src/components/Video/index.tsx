import React, { useEffect, useState } from 'react';
import {
    TbLayoutGrid,
    TbAppsOff
} from 'react-icons/tb';

import './index.scss';

type toggleFunction = (index: boolean) => void;

interface IProps {
    name: string;
    type: string;
    id?: string;
    onSwitchToggle?: toggleFunction;
}

const Video = (props: IProps) => {
    const [toggle, setToggle] = useState(false);
    let mouseOn = false;
    let dragElement: HTMLElement;
    let position = {
        x: 0,
        y: 0
    }
    let initPosition = {
        top: 0,
        left: 0
    }

    const changeToggle = () => {
        if (props.onSwitchToggle) {
            props.onSwitchToggle(!toggle);
        }
        setToggle(!toggle);
    }

    const handleMouseDown = (e: any) => {
        const element = e.toElement;
        if (element.getAttribute('class')?.includes('dragable')) {
            const type = element.getAttribute('data-ele');

            dragElement = document.getElementById(`video-${type}`) as HTMLElement;
            dragElement.style.transitionDuration = '0s';

            position.x = e.screenX;
            position.y = e.screenY;

            initPosition.top = Number(dragElement?.style.top.split('px')[0]);
            initPosition.left = Number(dragElement?.style.left.split('px')[0]);

            mouseOn = true;
        }
    }

    const handleMouseMove = (e: any) => {
        if (mouseOn) {
            const boardElement = document.getElementsByClassName('main-board')[0] as HTMLElement;
            const boardX = boardElement.offsetWidth;
            const boardY = boardElement.offsetHeight;

            let newPosX = e.screenX - position.x + initPosition.left;
            let newPosY = e.screenY - position.y + initPosition.top;

            if (newPosX > (boardX - dragElement.offsetWidth)) newPosX = boardX - dragElement.offsetWidth;
            if (newPosY > (boardY - dragElement.offsetHeight)) newPosY = boardY - dragElement.offsetHeight;
            if (newPosX < 0) newPosX = 0;
            if (newPosY < 0) newPosY = 0;

            dragElement.style.top = newPosY + 'px';
            dragElement.style.left = newPosX + 'px';
        }
    }

    const handleMouseUp = (e: any) => {
        mouseOn = false;
        if (dragElement)
            dragElement.style.transitionDuration = '0.5s';
    }

    useEffect(() => {
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className={`video-ele video-${props.type}`} id={`video-${props.id}`}>
            {
                props.type === "host" ?
                    <video poster="" autoPlay={true} muted className={`videoElement mirror-mode v-cover ${props.type}`} id={props.type} />
                    :
                    <video poster="" autoPlay={true} className={`videoElement v-cover ${props.type}`} id={props.type === 'screen' ? 'screen' : props.id} />
            }
            <div className="controller">
                <div className="drag-over" data-ele={props.id}></div>
                {
                    props.type === "host" ? <>
                        <div className="toggle-btn" onClick={changeToggle}>
                            {
                                toggle ? <TbAppsOff /> : <TbLayoutGrid />
                            }
                        </div>
                    </>
                        : <></>
                }
                <p>{props.name}</p>
            </div>
        </div>
    )
}

export default Video;