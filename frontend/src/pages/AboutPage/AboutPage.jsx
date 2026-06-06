import React from 'react';

const AboutPage = () => {
  return (
    <div style={{ width: '100%', background: '#efefef', padding: '30px 0', minHeight: 'calc(100vh - 440px)' }}>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#9255FD', marginBottom: '24px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          Giới thiệu về Tuny
        </h1>
        
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
          <p style={{ marginBottom: '16px' }}>
            Chào mừng bạn đến với <strong>Tuny Shop</strong> – địa chỉ tin cậy hàng đầu chuyên cung cấp linh kiện máy tính, phụ kiện công nghệ và các giải pháp máy tính tối ưu cho người dùng tại Việt Nam.
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            Câu chuyện thương hiệu
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Được thành lập với sứ mệnh mang lại những sản phẩm công nghệ chất lượng cao nhất với giá cả phải chăng, Tuny Shop không ngừng phát triển và hoàn thiện để trở thành bạn đồng hành tin cậy của mọi game thủ, lập trình viên, designer và các bạn đam mê công nghệ.
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            Sản phẩm & Dịch vụ của chúng tôi
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Chúng tôi tự hào phân phối các dòng sản phẩm linh kiện chính hãng từ các thương hiệu lớn trên thế giới:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Linh kiện máy tính: CPU, Mainboard, RAM, VGA, Ổ cứng SSD/HDD, Nguồn (PSU), Case...</li>
            <li>Gaming Gear: Bàn phím cơ, chuột chơi game, tai nghe gaming...</li>
            <li>Thiết bị văn phòng, laptop đời mới và các phụ kiện độc đáo khác.</li>
            <li>Dịch vụ build PC chuyên nghiệp theo yêu cầu riêng và ngân sách của khách hàng.</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            Cam kết từ Tuny
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Tại Tuny, sự hài lòng của khách hàng là ưu tiên số một. Chúng tôi cam kết:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li><strong>Chính hãng 100%:</strong> Mọi mặt hàng bán ra đều có nguồn gốc xuất xứ rõ ràng, đầy đủ hóa đơn chứng từ.</li>
            <li><strong>Bảo hành uy tín:</strong> Chế độ bảo hành nhanh chóng, tuân thủ đúng chính sách của hãng.</li>
            <li><strong>Hỗ trợ tận tâm:</strong> Đội ngũ tư vấn kỹ thuật giàu kinh nghiệm sẵn sàng giải đáp thắc mắc của bạn 24/7.</li>
          </ul>

          <div style={{ marginTop: '40px', padding: '20px', background: '#f9f6ff', borderRadius: '8px', borderLeft: '4px solid #9255FD' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#9255FD', fontWeight: 700 }}>Thông tin liên hệ</h3>
            <p style={{ margin: '4px 0' }}>📍 <strong>Địa chỉ:</strong> 97 Man Thiện, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM</p>
            <p style={{ margin: '4px 0' }}>📞 <strong>Hotline:</strong> 0392868631 (Mr. Tus)</p>
            <p style={{ margin: '4px 0' }}>✉️ <strong>Email:</strong> support@tuny.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
