import { Checkbox, Form } from "antd";
import React, { useEffect, useState } from "react";
import {
  CustomCheckbox,
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDilivery,
  WrapperTotal,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value,
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + ((cur.price * totalDiscount) / 100) * cur.amount;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo === 0 || order?.orderItemsSelected?.length === 0) {
      return 0;
    }
    if (priceMemo < 200000) {
      return 20000;
    } else if (priceMemo < 500000) {
      return 10000;
    } else {
      return 0;
    }
  }, [priceMemo, order?.orderItemsSelected]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);
  const handleRemoveAllOrder = () => {
    if (listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isLoading, data } = mutationUpdate;

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        },
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const progressPercent =
    order?.orderItemsSelected?.length > 0
      ? Math.min((priceMemo / 500000) * 100, 100)
      : 0;

  return (
    <div style={{ background: "#f5f5fa", width: "100%", minHeight: "100vh" }}>
      <div
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "1270px",
          margin: "0 auto",
          padding: "0 15px",
        }}
      >
        <h3 style={{ fontWeight: "bold" }}>Giỏ hàng</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <WrapperLeft style={{ width: "100%" }}>
            <h4 style={{ margin: "10px 0" }}>Ưu đãi phí giao hàng</h4>
            <WrapperStyleHeaderDilivery
              style={{
                flexDirection: "column",
                alignItems: "stretch",
                gap: "15px",
                padding: "15px 20px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <span style={{ fontSize: "20px" }}>🚚</span>
                <div>
                  {order?.orderItemsSelected?.length === 0 ? (
                    <span style={{ color: "#555" }}>
                      Vui lòng chọn sản phẩm để nhận ưu đãi phí giao hàng
                    </span>
                  ) : priceMemo < 200000 ? (
                    <span>
                      Mua thêm{" "}
                      <strong style={{ color: "#9255FD", fontSize: "15px" }}>
                        {convertPrice(200000 - priceMemo)}
                      </strong>{" "}
                      để giảm phí ship còn{" "}
                      <strong style={{ color: "#9255FD", fontSize: "15px" }}>
                        10.000đ
                      </strong>
                    </span>
                  ) : priceMemo < 500000 ? (
                    <span>
                      Mua thêm{" "}
                      <strong style={{ color: "#9255FD", fontSize: "15px" }}>
                        {convertPrice(500000 - priceMemo)}
                      </strong>{" "}
                      để được{" "}
                      <strong style={{ color: "#27ae60", fontSize: "15px" }}>
                        FREE SHIP
                      </strong>
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "#27ae60",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      Chúc mừng! Đơn hàng của bạn đã được FREE SHIP!{" "}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  position: "relative",
                  height: "6px",
                  background: "#ebebeb",
                  borderRadius: "3px",
                  margin: "10px 15px 25px 15px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${progressPercent}%`,
                    background:
                      "linear-gradient(90deg, #9255FD 0%, #b388ff 100%)",
                    borderRadius: "3px",
                    transition: "width 0.3s ease-in-out",
                  }}
                />

                {/* Milestone: Phí 20k (0đ) */}
                <div
                  style={{
                    position: "absolute",
                    left: "0%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: progressPercent >= 0 ? "#9255FD" : "#ccc",
                      border: "2px solid #fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      marginTop: "6px",
                      color: "#666",
                      whiteSpace: "nowrap",
                      fontWeight: "500",
                    }}
                  >
                    Phí ship 20k
                  </span>
                </div>

                {/* Milestone: Phí 10k (200k) */}
                <div
                  style={{
                    position: "absolute",
                    left: "40%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: priceMemo >= 200000 ? "#9255FD" : "#ccc",
                      border: "2px solid #fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      marginTop: "6px",
                      color: "#666",
                      whiteSpace: "nowrap",
                      fontWeight: priceMemo >= 200000 ? "600" : "400",
                    }}
                  >
                    Từ 200k (Ship 10k)
                  </span>
                </div>

                {/* Milestone: Free ship (500k) */}
                <div
                  style={{
                    position: "absolute",
                    left: "100%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: priceMemo >= 500000 ? "#27ae60" : "#ccc",
                      border: "2px solid #fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      marginTop: "6px",
                      color: "#666",
                      whiteSpace: "nowrap",
                      fontWeight: priceMemo >= 500000 ? "600" : "400",
                    }}
                  >
                    Từ 500k (Freeship)
                  </span>
                </div>
              </div>
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "550px" }}>
                <CustomCheckbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></CustomCheckbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllOrder}
                />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div
                      style={{
                        width: "550px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CustomCheckbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></CustomCheckbox>
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          width: 420,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          {convertPrice(order?.price)}
                        </span>
                      </span>
                      <WrapperCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount(
                              "decrease",
                              order?.product,
                              order?.amount === 1,
                            )
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                          min={1}
                          max={order?.countInstock}
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount(
                              "increase",
                              order?.product,
                              order?.amount === order.countInstock,
                              order?.amount === 1,
                            )
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{
                          color: "rgb(255, 66, 78)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>

          {/* Checkout Horizontal Info Bar */}
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "30px",
              marginTop: "15px",
            }}
          >
            {/* Column 1: Delivery Address */}
            <div
              style={{
                flex: 1.2,
                borderRight: "1px solid #f0f0f0",
                paddingRight: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  marginBottom: "8px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                ĐỊA CHỈ GIAO HÀNG
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#333",
                  lineHeight: "1.5",
                }}
              >
                {" "}
                {user?.address
                  ? `${user.address}, ${user.city || ""}`
                  : "Chưa có thông tin địa chỉ giao hàng"}
              </div>
              <div
                onClick={handleChangeAddress}
                style={{
                  color: "#9255FD",
                  cursor: "pointer",
                  fontSize: "13px",
                  marginTop: "8px",
                  display: "inline-block",
                  fontWeight: "600",
                }}
              >
                Thay đổi địa chỉ
              </div>
            </div>

            {/* Column 2: Breakdown prices */}
            <div
              style={{
                flex: 1,
                borderRight: "1px solid #f0f0f0",
                paddingRight: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#666" }}>Tạm tính:</span>
                <span style={{ fontWeight: "600", color: "#333" }}>
                  {convertPrice(priceMemo)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#666" }}>Giảm giá:</span>
                <span style={{ fontWeight: "600", color: "#27ae60" }}>
                  -{convertPrice(priceDiscountMemo)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#666" }}>Phí giao hàng:</span>
                <span style={{ fontWeight: "600", color: "#333" }}>
                  {convertPrice(diliveryPriceMemo)}
                </span>
              </div>
            </div>

            {/* Column 3: Total Price & Buy Button */}
            <div
              style={{
                flex: 1.3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "2px",
                  }}
                >
                  Tổng tiền thanh toán:
                </span>
                <span
                  style={{
                    color: "rgb(254, 56, 52)",
                    fontSize: "24px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap"
                  }}
                >
                  {convertPrice(totalPriceMemo)}
                </span>
                <span style={{ color: "#888", fontSize: "11px" }}>
                  (Đã bao gồm VAT nếu có)
                </span>
              </div>
              <ButtonComponent
                onClick={() => handleAddCard()}
                size={40}
                styleButton={{
                  background: "rgb(209, 34, 145)",
                  height: "48px",
                  padding: "0 35px",
                  border: "none",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(96, 10, 102, 0.2)",
                }}
                textbutton={"Mua hàng"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateInforUser}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
            >
              <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
