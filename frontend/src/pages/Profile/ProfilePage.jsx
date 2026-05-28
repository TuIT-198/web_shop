import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const [city, setCity] = useState('')

    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            return UserService.updateUser(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email || '')
        setName(user?.name || '')
        setPhone(user?.phone || '')
        setAddress(user?.address || '')
        setAvatar(user?.avatar || '')
        setCity(user?.city || '')
    }, [user])

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Cập nhật thông tin thành công')
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isSuccess && data?.status === 'ERR') {
            message.error(data?.message || 'Có lỗi xảy ra')
        } else if (isError) {
            message.error('Cập nhật thông tin thất bại')
        }
    }, [isSuccess, isError, data])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnchangeCity = (value) => {
        setCity(value)
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        if (fileList.length > 0) {
            const file = fileList[0]
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            setAvatar(file.preview)
        }
    }

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, city, access_token: user?.access_token })
    }

    return (
        <div style={{ width: '100%', maxWidth: '1270px', margin: '0 auto', minHeight: '500px', padding: '0 15px' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <WrapperInput style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <WrapperLabel style={{ width: '120px', minWidth: '120px' }} htmlFor="name">Họ tên</WrapperLabel>
                        <InputForm style={{ flex: 1 }} id="name" value={name} onChange={handleOnchangeName} />
                    </WrapperInput>
                    <WrapperInput style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <WrapperLabel style={{ width: '120px', minWidth: '120px' }} htmlFor="email">Email</WrapperLabel>
                        <InputForm style={{ flex: 1 }} id="email" value={email} onChange={handleOnchangeEmail} disabled />
                    </WrapperInput>
                    <WrapperInput style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <WrapperLabel style={{ width: '120px', minWidth: '120px' }} htmlFor="phone">Điện thoại</WrapperLabel>
                        <InputForm style={{ flex: 1 }} id="phone" value={phone} onChange={handleOnchangePhone} />
                    </WrapperInput>
                    <WrapperInput style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <WrapperLabel style={{ width: '120px', minWidth: '120px' }} htmlFor="city">Thành phố</WrapperLabel>
                        <InputForm style={{ flex: 1 }} id="city" value={city} onChange={handleOnchangeCity} />
                    </WrapperInput>
                    <WrapperInput style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <WrapperLabel style={{ width: '120px', minWidth: '120px' }} htmlFor="address">Địa chỉ</WrapperLabel>
                        <InputForm style={{ flex: 1 }} id="address" value={address} onChange={handleOnchangeAddress} />
                    </WrapperInput>
                    <WrapperInput style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '15px' }}>
                        <WrapperLabel style={{ width: '120px', minWidth: '120px' }} htmlFor="avatar">Ảnh đại diện</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Chọn file</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar"/>
                        )}
                    </WrapperInput>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '40px',
                                width: '200px',
                                borderRadius: '4px',
                                background: 'rgb(26, 148, 255)',
                                border: 'none'
                            }}
                            textbutton={'Lưu thay đổi'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </div>
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage