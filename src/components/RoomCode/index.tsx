import copyImg from '../../assets/images/copy.svg';

import './style.scss';

type roomCodeProps = {
    code: string;
}

export function RoomCode(props: roomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span className="code">Sala #{props.code}</span>
        </button>
    );
}