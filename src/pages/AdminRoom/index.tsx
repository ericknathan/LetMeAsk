import { useHistory, useParams } from 'react-router-dom';
import { Fragment } from 'react';

import Modal from 'react-modal';
import { useState } from 'react';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';
import { ModalStyle } from '../../components/Modal';
// import { useAuth } from '../../hooks/useAuth';
// import { database } from '../../services/firebase';

import '../../styles/room.scss';

// import toast from 'react-hot-toast';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>();
    const [closeModalOpen, setCloseModalOpen] = useState(false);

    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        setCloseModalOpen(false);

        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        });

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        setQuestionIdModalOpen(undefined);
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
    
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={() => setCloseModalOpen(true)}>Encerrar sala</Button>
                        <Modal
                            isOpen={closeModalOpen == true}
                            onRequestClose={() => setCloseModalOpen(false)}
                            className="modal"
                            overlayClassName="bg"
                        >
                            <ModalStyle
                                title="Encerrar sala"
                                acceptText="Sim, encerrar"
                                action={handleEndRoom}
                                toggleAction={() => setCloseModalOpen(false)}
                                type="close"
                            >Tem certeza que você deseja encerrar esta sala?</ModalStyle>
                        </Modal>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{ questions.length > 1 ? 's' : ''}</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Fragment key={question.id}>
                                <Question
                                    content={question.content}
                                    author={question.author}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setQuestionIdModalOpen(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                                <Modal
                                    isOpen={questionIdModalOpen === question.id}
                                    onRequestClose={() => setQuestionIdModalOpen(undefined)}
                                    className="modal"
                                    overlayClassName="bg"
                                >
                                    <ModalStyle
                                        title="Excluir pergunta"
                                        acceptText="Sim, excluir"
                                        action={() => handleDeleteQuestion(question.id)}
                                        toggleAction={() => setQuestionIdModalOpen(undefined)}
                                        type="delete"
                                    >Tem certeza que você deseja excluir esta pergunta?</ModalStyle>
                                </Modal>
                            </Fragment>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}