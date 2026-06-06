import React from 'react';

const PurchaseGuidePage = () => {
  return (
    <div style={{ width: '100%', background: '#efefef', padding: '30px 0', minHeight: 'calc(100vh - 440px)' }}>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#9255FD', marginBottom: '24px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          Hướng dẫn mua hàng
        </h1>
        
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
          <p style={{ marginBottom: '16px' }}>
            Mua sắm trực tuyến tại <strong>Tuny Shop</strong> cực kỳ dễ dàng, nhanh chóng và an toàn. Quý khách có thể lựa chọn mua hàng thông qua các bước đơn giản sau:
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            Bước 1: Tìm kiếm sản phẩm
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Bạn có thể tìm kiếm sản phẩm cần mua bằng cách:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Sử dụng thanh tìm kiếm phía trên cùng để nhập tên sản phẩm, thương hiệu hoặc từ khóa liên quan.</li>
            <li>Duyệt tìm sản phẩm theo danh mục sản phẩm (iPhone, Laptop, Bàn phím...) ở menu điều hướng.</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            Bước 2: Thêm vào giỏ hàng
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Khi đã tìm được sản phẩm ưng ý, bấm vào sản phẩm để xem chi tiết thông số kỹ thuật, giá bán và hình ảnh thực tế. Sau đó bấm nút <strong>Thêm vào giỏ hàng</strong> hoặc <strong>Mua ngay</strong> để đi đến trang thanh toán.
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            Bước 3: Nhập thông tin giao hàng & chọn Phương thức thanh toán
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Tại trang giỏ hàng, quý khách điền đầy đủ các thông tin cần thiết:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Họ và tên người nhận, số điện thoại liên lạc chính xác.</li>
            <li>Địa chỉ nhận hàng chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố).</li>
            <li>Lựa chọn phương thức thanh toán phù hợp: Thanh toán khi nhận hàng (COD) hoặc chuyển khoản ngân hàng qua cổng trực tuyến.</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            Bước 4: Xác nhận và theo dõi đơn hàng
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Sau khi bấm nút <strong>Đặt hàng</strong>, hệ thống sẽ gửi thông báo xác nhận thành công. Tuny Shop sẽ liên hệ bằng điện thoại để xác nhận đơn và tiến hành đóng gói giao hàng cho đối tác vận chuyển. Bạn có thể theo dõi tiến độ đơn hàng trong mục <strong>Đơn hàng của tôi</strong> sau khi đăng nhập.
          </p>

          <div style={{ marginTop: '40px', padding: '20px', background: '#f9f6ff', borderRadius: '8px', borderLeft: '4px solid #9255FD' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#9255FD', fontWeight: 700 }}>Hỗ trợ đặt hàng nhanh</h3>
            <p style={{ margin: '4px 0' }}>Nếu gặp khó khăn trong quá trình mua hàng trực tuyến, quý khách vui lòng liên hệ:</p>
            <p style={{ margin: '4px 0' }}>📞 <strong>Số điện thoại:</strong> 0392868631 (Mr. Tus)</p>
            <p style={{ margin: '4px 0' }}>💬 Hỗ trợ trực tiếp thông qua fanpage xã hội của shop.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseGuidePage;
