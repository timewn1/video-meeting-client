import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Store } from 'react-notifications-component';

import h from '../../lib/helpers';

import './index.scss';

const Home = () => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isDisable, setIsDisable] = useState(false);
    const [isCodeInput, setIsCodeInput] = useState(false);

    const navigate = useNavigate();

    const setMedia = async () => {
        try {
            const stream = await h.getUserFullMedia({
                audioInput: '',
                video: ''
            });
            h.setLocalStream(stream);
        } catch (err) {
            console.error('media error = ', err);
        }
    }

    const nextRoom = (type: string) => {
        if (name === '' || name.trim() === '') {
            Store.addNotification({
                message: `Input correct name`,
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
            return;
        }

        setIsCodeInput(true);
        if (type === 'create') {
            const id = uuidv4();
            setCode(id.substring(4, 23));
            setIsDisable(true);
        } else if (type === 'join') {
            setCode('');
            setIsDisable(false);
        }
    }

    const goToRoom = () => {
        console.log('gotoroom');
        if (code === '' || code.trim() === '') {
            Store.addNotification({
                message: `Input correct room ID`,
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

            return;
        }

        window.sessionStorage.setItem('username', name);
        window.location.href = `/room/#${code}`
        // navigate(`/room/#${code}`);
    }

    useEffect(() => {
        setMedia();
    }, [])

    return (
        <div id="home">
            <video id="host" autoPlay={true} muted ></video>
            <div id="input-modal" className={`modal center show`}>
                <div className="overlay"></div>
                <div className="modal-content">
                    <div className="modal-body">
                        {
                            !isCodeInput ?
                                <div>
                                    <p>NAME</p>
                                    <input type="text" placeholder="John" value={name} onChange={e => setName(e.target.value)} />
                                </div> :
                                <div>
                                    <p>ROOM ID</p>
                                    <input type="text" placeholder="room id" disabled={isDisable} value={code} onChange={e => setCode(e.target.value)} />
                                </div>
                        }
                        <div className="modal-btn-group">
                            {
                                !isCodeInput ?
                                    <>
                                        <button onClick={() => nextRoom('create')}>CREATE ROOM</button>
                                        <button onClick={() => nextRoom('join')}>JOIN ROOM</button>
                                    </> :
                                    <>
                                        <button onClick={() => setIsCodeInput(false)}>BACK</button>
                                        <button onClick={goToRoom}>GO TO ROOM</button>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home;