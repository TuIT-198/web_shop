import React from 'react';

const WarrantyPolicyPage = () => {
  return (
    <div style={{ width: '100%', background: '#efefef', padding: '30px 0', minHeight: 'calc(100vh - 440px)' }}>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#9255FD', marginBottom: '24px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          Chính sách bảo hành
        </h1>
        
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
          <p style={{ marginBottom: '16px' }}>
            Tại <strong>Tuny Shop</strong>, chúng tôi luôn nỗ lực tối đa để mang lại cho quý khách hàng trải nghiệm mua sắm hài lòng nhất cùng dịch vụ bảo hành sản phẩm uy tín, nhanh gọn theo đúng cam kết từ nhà sản xuất.
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            1. Thời hạn bảo hành
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Tất cả các sản phẩm do Tuny phân phối đều được hưởng thời gian bảo hành chính hãng từ <strong>12 đến 36 tháng</strong> (thời gian chi tiết được ghi rõ trên tem bảo hành hoặc phiếu mua hàng đi kèm sản phẩm).
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            2. Điều kiện bảo hành hợp lệ
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Sản phẩm được bảo hành miễn phí khi đáp ứng các điều kiện sau:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Sản phẩm còn trong thời hạn bảo hành tính từ ngày mua.</li>
            <li>Có tem bảo hành của Tuny Shop hoặc tem của nhà phân phối chính hãng còn nguyên vẹn, không có dấu hiệu bị rách, tẩy xóa hoặc dán đè.</li>
            <li>Sản phẩm gặp lỗi kỹ thuật do lỗi của nhà sản xuất trong quá trình sản xuất hoặc vận chuyển.</li>
            <li>Thiết bị chưa bị tự ý tháo dỡ, can thiệp hoặc sửa chữa bởi bên thứ ba.</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            3. Các trường hợp từ chối bảo hành
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Tuny có quyền từ chối bảo hành đối với các trường hợp:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Sản phẩm hư hỏng do lỗi sử dụng: rơi vỡ, móp méo, trầy xước nặng, bị ngấm nước hoặc hóa chất.</li>
            <li>Sử dụng nguồn điện không ổn định, sai điện áp quy định gây cháy nổ linh kiện.</li>
            <li>Hư hại do thiên tai, hỏa hoạn, lũ lụt, sét đánh hoặc côn trùng xâm nhập phá hoại.</li>
            <li>Tem bảo hành hoặc số Serial Number (S/N) trên sản phẩm bị mất, rách nát hoặc không thể nhận diện.</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            4. Quy trình bảo hành
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Quy trình tiếp nhận và xử lý bảo hành cực kỳ đơn giản:
          </p>
          <ol style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Mang sản phẩm trực tiếp đến cửa hàng Tuny tại địa chỉ: <strong>97 Man Thiện, Thủ Đức, TP.HCM</strong> để kỹ thuật viên kiểm tra trực tiếp.</li>
            <li>Đối với khách hàng ở xa, liên hệ Hotline <strong>0392868631</strong> để nhận hướng dẫn gửi chuyển phát nhanh sản phẩm về trung tâm bảo hành của shop.</li>
            <li>Thời gian xử lý bảo hành thông thường từ 3 đến 7 ngày làm việc (không tính thứ 7, Chủ Nhật).</li>
          </ol>

          <div style={{ marginTop: '40px', padding: '20px', background: '#f9f6ff', borderRadius: '8px', borderLeft: '4px solid #9255FD' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#9255FD', fontWeight: 700 }}>Trung tâm hỗ trợ kỹ thuật Tuny</h3>
            <p style={{ margin: '4px 0' }}>📍 <strong>Địa chỉ nhận bảo hành:</strong> 97 Man Thiện, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM</p>
            <p style={{ margin: '4px 0' }}>📞 <strong>Hotline kỹ thuật:</strong> 0392868631 (Mr. Tus)</p>
            <p style={{ margin: '4px 0' }}>⏰ <strong>Giờ làm việc:</strong> 8:30 – 18:00 (Thứ 2 đến Thứ Bảy)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicyPage;
