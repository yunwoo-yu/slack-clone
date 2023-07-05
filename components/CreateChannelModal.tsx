import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Dispatch, FormEvent, SetStateAction } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Modal from './Modal';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
}

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }: Props) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const { mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = (e: FormEvent) => {
    e.preventDefault();

    axios
      .post(
        `/api/workspaces/${workspace}/channels`,
        {
          name: newChannel,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        setShowCreateChannelModal(false);
        mutateChannel();
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response.data, { position: 'bottom-center' });
      });
  };

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button>생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
