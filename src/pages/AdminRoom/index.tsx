import { useHistory, useParams } from 'react-router-dom';

import Modal from 'react-modal';
import { Fragment, useState } from 'react';

import logoImg from '../../assets/images/logo.svg';
import logoWhiteImg from '../../assets/images/logo-white.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import emptyImg from '../../assets/images/empty-questions.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';
import { ModalStyle } from '../../components/Modal';

import { useTheme } from '../../hooks/useTheme';

import '../../styles/room.scss';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>();
    const [closeModalOpen, setCloseModalOpen] = useState(false);

    const { title, questions } = useRoom(roomId);

    const { theme } = useTheme();

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
    
    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }
    
    return (
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    <img src={theme === 'light' ? logoImg : logoWhiteImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={() => setCloseModalOpen(true)}>Encerrar sala</Button>
                        <Modal
                            isOpen={closeModalOpen === true}
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
                {   
                        questions.length > 0 ? questions.map(question => {
                            return (
                                <Fragment key={question.id}>
                                    <Question
                                        content={question.content}
                                        author={question.author}
                                        isAnswered={question.isAnswered}
                                        isHighlighted={question.isHighlighted}
                                    >
                                        {!question.isAnswered && (
                                            <Fragment>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                                >
                                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleHighlightQuestion(question.id)}
                                                >
                                                    <img src={answerImg} alt="Dar destaque à pergunta" />
                                                </button>
                                            </Fragment>
                                        )}
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
                        }) : <div className="empty-questions">
                                <img src={emptyImg} alt="Ilustração de perguntas" />
                                <h2>Nenhuma pergunta por aqui...</h2>
                                <p>Os participantes da sala ainda não enviaram perguntas.</p>
                            </div>
                    }
                </div>
            </main>
        </div>
    )
}