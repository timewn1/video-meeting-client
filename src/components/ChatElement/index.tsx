import React from "react";
import { BsFillFileEarmarkCheckFill, BsDownload } from "react-icons/bs";

import { IMessage } from "../../type";

import Utills from '../../lib/utills.js';

import { SERVER_URL } from "../../config/index.ts";

import './index.scss';

interface IProps {
    data: IMessage,
    myId: string,
}

export const ChatElement = (props: IProps) => {
    return <div className={`chat-element ${props.data.user_id === props.myId ? 'right' : 'left'}`}>
        {
            props.data.user_id !== props.myId ? <p className="user-name">{props.data.userName}</p> : ''
        }
        <div>
            {
                props.data.isFile ?
                    <>
                        <BsFillFileEarmarkCheckFill />
                        {Utills.recudeFileName(props.data.content)}
                        <a target='_blank' href={`${SERVER_URL}/download?uploaded=${props.data.uploadedName}&name=${props.data.content}`} download>
                            <BsDownload />
                        </a>
                    </> :
                    props.data.content
            }
        </div>
        <p className="time">{Utills.convertTime(props.data.time)}</p>
    </div>
}