import deleteImg from '../../assets/images/trash.svg';
import uncheckImg from '../../assets/images/uncheck.svg';

import { Button } from '../Button';

import './style.scss';

type ModalProperties = {
  action: () => void;
  toggleAction: () => void;
  title: string;
  children: string;
  acceptText: string;
  type: 'delete' | 'close'; 
}


export function ModalStyle(props: ModalProperties) {

  return(
      <div className="modal-box">
          { props.type == 'delete' ? <img src={deleteImg} alt="Deletar" /> : <img src={uncheckImg} alt="Encerrar" />}
          <h2>{props.title}</h2>
          <span>{props.children}</span>
          <div className="buttons">
              <Button id="cancel" onClick={props.toggleAction}>Cancelar</Button>
              <Button id="confirm" onClick={props.action}>{props.acceptText}</Button>
          </div>
      </div>
  );

}