import React, { useEffect, useState, useRef } from 'react';
import { Store } from 'react-notifications-component';
import {
    FaCog,
    FaPhone,
    FaVideo,
    FaDesktop,
    FaVideoSlash,
    FaMicrophone,
    FaMicrophoneSlash,
} from 'react-icons/fa';
import {
    BsXLg,
    BsFillChatRightDotsFill,
    BsFillFileEarmarkCheckFill
} from 'react-icons/bs';
import { BiSend } from 'react-icons/bi';
import { ImAttachment } from 'react-icons/im';

import { IPc, IActive, IMessage } from '../../type';

import Utills from '../../lib/utills.js';

import { SERVER_URL } from '../../config/index.ts';

import { ChatElement } from '../ChatElement';

import './index.scss';

type toggleFunction = (type: string) => void;
type onSettingFunction = (index: string, type: string) => void;
type screenSharingFunction = () => void;

interface IProps {
    hostPc: IPc | null;
    socket: any;
    partner: IPc[];
    onToggle: toggleFunction;
    screenSharing: screenSharingFunction;
    onSetting: onSettingFunction;
}

const Navbar = (props: IProps) => {
    const [badge, setBadge] = useState<boolean>(false);
    const [chatText, setChatText] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [chatList, setChatList] = useState<IMessage[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    const [videoList, setVideoList] = useState<any[]>([]);
    const [audioInputList, setAudioInputList] = useState<any[]>([]);
    const [audioOutputList, setAudioOutputList] = useState<any[]>([]);

    const [activeButton, setActiveButton] = useState<IActive>(
        {
            exit: false,
            setting: false,
            chat: false,
            audio: true,
            video: true
        });

    const fileRef = useRef<HTMLInputElement>(null);
    const chatRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileDisplayRef = useRef<HTMLDivElement>(null);

    const room = window.location.hash.split('#')[1];

    const changeActive = (key: string) => {
        const active = { ...activeButton }
        active[key] = !active[key];
        if (key === 'audio' || key === 'video') {
            props.onToggle(key);
        }
        setActiveButton(active);
        if (key === 'chat' && badge) {
            setBadge(false);
        }
    }

    const getDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const _videoList = devices.filter(device => device.kind === 'videoinput');
        const _audioInputList = devices.filter(device => device.kind === 'audioinput');
        const _audioOutputList = devices.filter(device => device.kind === 'audiooutput');

        setVideoList(_videoList);
        setAudioInputList(_audioInputList);
        setAudioOutputList(_audioOutputList);
    }

    const selectOption = (type: string, e: any) => {
        props.onSetting(e.target.value, type);
    }

    const changeText = (e: any) => {
        const text = e.target.value;

        if (text.length > 25 || text.split('\n').length >= 2) {
            if (chatRef.current)
                chatRef.current.style.height = '2.7em';
        }

        if (text.length < 25 && text.split('\n').length < 2) {
            if (chatRef.current)
                chatRef.current.style.height = '1.5em';
        }

        setChatText(text)
    }

    const sendMessage = async () => {
        if (!props.hostPc) return;

        if (fileName !== '') {
            if (fileRef.current && fileRef.current.files) {
                if (props.partner.length > 0) {
                    const uploadedName = new Date().valueOf().toString();
                    const data = {
                        time: new Date(),
                        isFile: true,
                        content: fileName,
                        user_id: props.hostPc?.clientId,
                        userName: props.hostPc?.username,
                        uploadedName: uploadedName,
                    }

                    let formData = new FormData();

                    formData.append('name', uploadedName);
                    formData.append('file', fileRef.current.files[0]);

                    try {
                        setUploading(true);
                        const res = await fetch(`${SERVER_URL}/upload`, {
                            method: 'POST',
                            body: formData
                        })

                        const result = await res.json();

                        if (result.state) {
                            props.socket.emit('sendChat', {
                                content: data,
                                to: room
                            });

                            setChatList([...chatList, data]);
                        } else {
                            Store.addNotification({
                                title: 'Failed!',
                                message: 'File transfer is failed',
                                type: 'danger',
                                insert: 'top',
                                container: 'top-right',
                                animationIn: ['animate__animated', 'animate__fadeIn'],
                                animationOut: ['animate__animated', 'animate__fadeOut'],
                                dismiss: {
                                    duration: 2000,
                                    onScreen: true
                                }
                            });
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    setUploading(false);
                    removeFile();
                }
            }
        }
        else {
            let txt = chatText.replaceAll("\n\n", "");

            if (txt && txt !== '\n') {
                const data = {
                    time: new Date(),
                    content: chatText,
                    user_id: props.hostPc?.clientId,
                    userName: props.hostPc?.username,
                    isFile: false,
                }

                if (props.partner.length > 0) {
                    props.socket.emit('sendChat', {
                        content: data,
                        to: room
                    });
                }

                setChatList([...chatList, data]);
                setChatText('');

                if (chatRef.current)
                    chatRef.current.style.height = '1.5em';
            }
        }
        chatRef.current?.focus();
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    const uploadFile = () => {
        if (fileRef.current && fileRef.current.files) {
            // MAX size 100MB
            if (fileRef.current.files[0].size > 104856700) {
                alert('File is too big!');
                fileRef.current.value = '';
                return;
            }
            setFileName(fileRef.current.files[0].name);

            if (chatRef.current)
                chatRef.current.style.display = 'none';
            if (fileDisplayRef.current)
                fileDisplayRef.current.style.display = 'flex';
        }
    }

    const removeFile = () => {
        setFileName('');
        if (fileRef.current)
            fileRef.current.value = '';

        if (chatRef.current)
            chatRef.current.style.display = 'block';
        if (fileDisplayRef.current)
            fileDisplayRef.current.style.display = 'none';
    }

    const onExit = () => {
        window.sessionStorage.clear();
        window.location.href = '/';
    }

    useEffect(() => {
        getDevices();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);

        props.socket.on('receiveChat', (data: any) => {
            setChatList([...chatList, data.data]);
            setBadge(true);
        })

        return () => {
            props.socket.off('receiveChat');
        }
    }, [chatList])

    return (
        <>
            <nav>
                <div>
                    <div className="x-btn x-controller">
                        <span onClick={() => changeActive('chat')}>
                            <BsFillChatRightDotsFill />
                            {
                                badge ? <span className="badge" ></span> : <></>
                            }
                        </span>
                        <span onClick={() => props.screenSharing()} ><FaDesktop /></span>
                        <span onClick={() => changeActive('audio')}>{activeButton.audio ? <FaMicrophone /> : <FaMicrophoneSlash />}</span>
                        <span onClick={() => changeActive('video')}>{activeButton.video ? <FaVideo /> : <FaVideoSlash />}</span>
                        <span onClick={() => changeActive('setting')}><FaCog /></span>
                        <span className="active" onClick={() => changeActive('exit')}>
                            <FaPhone />
                        </span>
                    </div>
                </div>
            </nav>
            <div className={`modal left ${activeButton.chat ? "show" : ""}`} onClick={() => setBadge(false)}>
                <div className="modal-content">
                    <div className="modal-header">
                        <span onClick={() => { changeActive('chat') }}><BsXLg /></span>
                    </div>
                    <div className="modal-body">
                        <div>
                            {
                                chatList.map((ele, index) => (
                                    <ChatElement key={index} {...{ data: ele, myId: props.hostPc?.clientId + '' }} />
                                ))
                            }
                        </div>
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className="modal-footer">
                        <textarea
                            className="chat-box"
                            placeholder="Type a message"
                            ref={chatRef}
                            value={chatText}
                            onChange={(e) => changeText(e)}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter' && !e.shiftKey) {
                                    sendMessage();
                                    e.preventDefault();
                                }
                            }}
                        />
                        <div ref={fileDisplayRef} className="file-element" ><BsFillFileEarmarkCheckFill />&nbsp;{Utills.recudeFileName(fileName)}
                            {
                                !uploading ? <span onClick={removeFile}><BsXLg /></span> :
                                    <span className="spin" role="progressbar">
                                        <svg viewBox="22 22 44 44">
                                            <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>
                                        </svg>
                                    </span>
                            }
                        </div>
                        <span className="chat-send-btn" onClick={() => sendMessage()}><BiSend /></span>
                        <span onClick={() => { fileRef.current?.click(); }}><ImAttachment /></span>
                        <input type="file" ref={fileRef} onChange={() => uploadFile()} />
                    </div>
                </div>
            </div>
            <div className={`modal center ${activeButton.exit ? "show" : ''}`}>
                <div className="modal-content">
                    <div className="modal-footer">
                        <h1>Do you want to exit this session?</h1>
                        <div className="btn-group">
                            <button onClick={onExit}>Yes</button>
                            <button onClick={() => changeActive('exit')}>No</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal right ${activeButton.setting ? "show" : ''}`}>
                <div className="overlay" onClick={() => changeActive('setting')}></div>
                <div className="modal-content">
                    <div className="modal-body">
                        <h1>Settings</h1>
                        <p>Camera</p>
                        <select onChange={(e) => selectOption('video', e)}>
                            {
                                videoList.map((ele) => (
                                    <option key={ele.deviceId} value={ele.deviceId} >{ele.label}</option>
                                ))
                            }
                        </select>
                        <p>Microphone</p>
                        <select onChange={(e) => selectOption('audioInput', e)}>
                            {
                                audioInputList.map((ele) => (
                                    <option key={ele.deviceId} value={ele.deviceId}>{ele.label}</option>
                                ))
                            }
                        </select>
                        <p>Speaker</p>
                        <select onChange={(e) => selectOption('audioOutput', e)}>
                            {
                                audioOutputList.map((ele) => (
                                    <option key={ele.deviceId} value={ele.deviceId}>{ele.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button onClick={() => { changeActive('setting') }}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;