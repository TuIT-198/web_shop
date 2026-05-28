import React, { useState } from 'react'
import { WrapperHeader } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { convertPrice } from '../../utils'
import * as OrderService from '../../services/OrderService'
import { useQuery, useMutation } from '@tanstack/react-query'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'
import { Select, Space, Button, Table, Tag } from 'antd'
import * as message from '../../components/Message/Message'

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders, refetch } = queryOrder

  // Update order status mutation
  const mutationUpdateStatus = useMutation({
    mutationFn: ({ id, status }) => OrderService.updateOrderStatus(id, { status }, user?.access_token),
    onSuccess: (res) => {
      if (res?.status === 'OK') {
        message.success('Cập nhật trạng thái đơn hàng thành công')
        refetch()
      } else {
        message.error(res?.message || 'Có lỗi xảy ra')
      }
    },
    onError: () => {
      message.error('Cập nhật thất bại')
    }
  })

  const handleUpdateStatus = (id, status) => {
    mutationUpdateStatus.mutate({ id, status })
  }

  const handleViewDetails = (record) => {
    setSelectedOrderDetails(record)
    setIsOpenModalDetail(true)
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              clearFilters()
              confirm()
            }}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false,
  })

  const statusTranslate = {
    pending: { label: 'Chờ xác nhận', color: 'orange' },
    confirmed: { label: 'Đã xác nhận', color: 'blue' },
    shipping: { label: 'Đang giao', color: 'cyan' },
    delivered: { label: 'Đã giao', color: 'green' },
    cancelled: { label: 'Đã hủy', color: 'red' }
  }

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      ...getColumnSearchProps('address')
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      render: (text) => <span>{text === 'later_money' || text === 'Thanh toán tiền mặt khi nhận hàng' ? 'Tiền mặt (COD)' : text}</span>
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      render: (text, record) => <span>{convertPrice(record.rawTotalPrice)}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text) => {
        const info = statusTranslate[text] || { label: text, color: 'default' };
        return <Tag color={info.color}>{info.label}</Tag>
      }
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>Chi tiết</Button>
          <Select
            defaultValue={record.status}
            style={{ width: 150 }}
            onChange={(value) => handleUpdateStatus(record._id, value)}
            options={[
              { value: 'pending', label: 'Chờ xác nhận' },
              { value: 'confirmed', label: 'Đã xác nhận' },
              { value: 'shipping', label: 'Đang giao' },
              { value: 'delivered', label: 'Đã giao' },
              { value: 'cancelled', label: 'Đã hủy' },
            ]}
          />
        </Space>
      )
    },
  ]

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { 
      ...order, 
      key: order._id, 
      userName: order?.shippingAddress?.fullName, 
      phone: order?.shippingAddress?.phone, 
      address: `${order?.shippingAddress?.address}, ${order?.shippingAddress?.city}`, 
      paymentMethod: orderContant.payment[order?.paymentMethod] || order?.paymentMethod,
      rawTotalPrice: order?.totalPrice,
      totalPrice: convertPrice(order?.totalPrice)
    }
  })

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} />
      </div>

      {/* Details Modal */}
      <ModalComponent 
        title="Chi tiết đơn hàng" 
        open={isOpenModalDetail} 
        onCancel={() => setIsOpenModalDetail(false)} 
        footer={[
          <Button key="close" type="primary" onClick={() => setIsOpenModalDetail(false)}>Đóng</Button>
        ]}
      >
        {selectedOrderDetails && (
          <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
            <h4 style={{ fontWeight: 'bold' }}>Thông tin giao hàng</h4>
            <p><strong>Người nhận:</strong> {selectedOrderDetails?.shippingAddress?.fullName}</p>
            <p><strong>Số điện thoại:</strong> {selectedOrderDetails?.shippingAddress?.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrderDetails?.shippingAddress?.address}, {selectedOrderDetails?.shippingAddress?.city}</p>
            <p><strong>Phương thức thanh toán:</strong> {selectedOrderDetails?.paymentMethod === 'later_money' ? 'Tiền mặt (COD)' : selectedOrderDetails?.paymentMethod}</p>
            <p><strong>Trạng thái:</strong> {statusTranslate[selectedOrderDetails?.status]?.label}</p>
            
            <h4 style={{ fontWeight: 'bold', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>Sản phẩm đã mua</h4>
            <Table
              dataSource={selectedOrderDetails?.orderItems}
              pagination={false}
              rowKey="product"
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'amount',
                  key: 'amount',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (text) => convertPrice(text)
                },
              ]}
            />
            
            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
              <p><strong>Tiền sản phẩm:</strong> {convertPrice(selectedOrderDetails?.itemsPrice)}</p>
              <p><strong>Phí vận chuyển:</strong> {convertPrice(selectedOrderDetails?.shippingPrice)}</p>
              <p style={{ fontSize: '18px', color: 'red' }}><strong>Tổng tiền:</strong> {convertPrice(selectedOrderDetails?.rawTotalPrice)}</p>
            </div>
          </div>
        )}
      </ModalComponent>
    </div>
  )
}

export default OrderAdmin