import { Form, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const navigate = useNavigate()

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const handleDelivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + ((cur.price * totalDiscount / 100) * cur.amount)
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo === 0 || order?.orderItemsSelected?.length === 0) {
      return 0
    }
    if (delivery === 'fast') {
      if(priceMemo < 200000){
        return 20000
      }else if(priceMemo < 500000) {
        return 10000
      } else {
        return 0
      }
    } else if (delivery === 'gojek') {
      return 15000
    } else {
      // standard
      if(priceMemo < 200000){
        return 30000
      }else if(priceMemo < 500000) {
        return 20000
      } else {
        return 10000
      }
    }
  },[priceMemo, order?.orderItemsSelected, delivery])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemsSelected && user?.name
      && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
        // eslint-disable-next-line no-unused-vars
        const isPaid = payment === 'paypal' || payment === 'vnpay'
        mutationAddOrder.mutate(
          { 
            token: user?.access_token, 
            orderItems: order?.orderItemsSelected, 
            fullName: user?.name,
            address:user?.address, 
            phone:user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            email: user?.email
          }
        )
      }
  }
  
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )

  const {isLoading, data} = mutationUpdate
  const {data: dataAdd,isLoading:isLoadingAddOrder, isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order?.orderItemsSelected?.forEach(element => {
        arrayOrdered.push(element.product)
      });
      dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', {
        state: {
          delivery: delivery,
          payment: payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo
        }
      })
    } else if (isError) {
      message.error('Đã xảy ra lỗi khi đặt hàng')
    }
  }, [isSuccess, isError])

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const handleUpdateInforUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{background: '#f5f5fa', width: '100%', minHeight: '100vh'}}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{height: '100%', width: '100%', maxWidth: '1270px', margin: '0 auto', padding: '0 15px'}}>
          <h3 style={{fontWeight: 'bold', paddingTop: '15px'}}>Thanh toán</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <WrapperLeft style={{width: '100%'}}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                <WrapperInfo style={{ flex: 1, borderRadius: '6px', border: '1px solid #e5e5e5' }}>
                  <div>
                    <Lable>Chọn phương thức giao hàng</Lable>
                    <WrapperRadio onChange={handleDelivery} value={delivery} style={{ width: '100%', maxWidth: '100%' }}>
                      <Radio value="fast" style={{ width: '100%' }}>
                        <span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm
                      </Radio>
                      <Radio value="gojek" style={{ width: '100%' }}>
                        <span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng nhanh
                      </Radio>
                    </WrapperRadio>
                  </div>
                </WrapperInfo>
                <WrapperInfo style={{ flex: 1, borderRadius: '6px', border: '1px solid #e5e5e5' }}>
                  <div>
                    <Lable>Chọn phương thức thanh toán</Lable>
                    <WrapperRadio onChange={handlePayment} value={payment} style={{ width: '100%', maxWidth: '100%' }}>
                      <Radio value="later_money" style={{ width: '100%' }}>
                        Thanh toán tiền mặt khi nhận hàng (COD)
                      </Radio>
                      <Radio value="vnpay" style={{ width: '100%' }}>
                        Thanh toán bằng VNPay
                      </Radio>
                      <Radio value="momo" style={{ width: '100%' }}>
                        Thanh toán bằng ví MoMo
                      </Radio>
                    </WrapperRadio>
                  </div>
                </WrapperInfo>
              </div>

              {/* Order items preview */}
              <WrapperInfo>
                <Lable>Sản phẩm đặt mua</Lable>
                <div style={{ marginTop: '10px' }}>
                  {order?.orderItemsSelected?.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '8px 0',
                      borderBottom: idx < order.orderItemsSelected.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <img src={item.image} alt={item.name} style={{
                        width: '48px', height: '48px', objectFit: 'cover',
                        borderRadius: '6px', border: '1px solid #eee', flexShrink: 0
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px', fontWeight: 500, color: '#262626',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>Số lượng: {item.amount}</div>
                      </div>
                      <span style={{ fontWeight: 600, color: '#ff4d4f', fontSize: '13px', flexShrink: 0 }}>
                        {convertPrice(item.price * item.amount)}
                      </span>
                    </div>
                  ))}
                  {(!order?.orderItemsSelected || order.orderItemsSelected.length === 0) && (
                    <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                      Không có sản phẩm nào được chọn
                    </div>
                  )}
                </div>
              </WrapperInfo>
            </WrapperLeft>

            {/* Checkout Horizontal Info Bar */}
            <div style={{ 
              background: '#fff', 
              padding: '20px', 
              borderRadius: '6px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              gap: '30px',
              marginTop: '15px'
            }}>
              {/* Column 1: Delivery Address */}
              <div style={{ flex: 1.2, borderRight: '1px solid #f0f0f0', paddingRight: '20px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>ĐỊA CHỈ NHẬN HÀNG</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', lineHeight: '1.5' }}>
                  📍 {user?.address ? `${user.address}, ${user.city || ''}` : 'Chưa có thông tin địa chỉ nhận hàng'}
                </div>
                <div 
                  onClick={handleChangeAddress} 
                  style={{ color: '#9255FD', cursor: 'pointer', fontSize: '13px', marginTop: '8px', display: 'inline-block', fontWeight: '600' }}
                >
                  Thay đổi địa chỉ
                </div>
              </div>

              {/* Column 2: Breakdown prices */}
              <div style={{ flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#666' }}>Tạm tính:</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#666' }}>Giảm giá:</span>
                  <span style={{ fontWeight: '600', color: '#27ae60' }}>-{convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#666' }}>Phí giao hàng:</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>{convertPrice(diliveryPriceMemo)}</span>
                </div>
              </div>

              {/* Column 3: Total Price & Order Button */}
              <div style={{ flex: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>Tổng tiền thanh toán:</span>
                  <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{convertPrice(totalPriceMemo)}</span>
                  <span style={{ color: '#888', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                </div>
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                      background: 'rgb(255, 57, 69)',
                      height: '48px',
                      padding: '0 35px',
                      border: 'none',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(255, 57, 69, 0.2)'
                  }}
                  textbutton={'Đặt hàng'}
                  styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}
                />
              </div>
            </div>
          </div>
        </div>
        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isLoading}>
          <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>
              <Form.Item
                label="Thành phố"
                name="city"
                rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
              >
                <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
              <Form.Item
                label="SĐT"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage