import React from 'react';

const FaqPage = () => {
  const faqs = [
    {
      q: "Shop có giao hàng toàn quốc không? Thời gian giao hàng bao lâu?",
      a: "Tuny Shop giao hàng trên toàn quốc. Thời gian giao hàng dao động từ 1 - 2 ngày (khu vực TP.HCM) và từ 3 - 5 ngày đối với các tỉnh thành khác."
    },
    {
      q: "Tôi có thể thanh toán bằng những hình thức nào?",
      a: "Chúng tôi hỗ trợ hai hình thức thanh toán chính: Thanh toán khi nhận hàng (COD) và Chuyển khoản ngân hàng trực tiếp qua cổng thanh toán bảo mật trên website."
    },
    {
      q: "Làm thế nào để tôi biết sản phẩm của mình mua được bảo hành bao lâu?",
      a: "Thời hạn bảo hành của từng sản phẩm được ghi cụ thể trong phần mô tả sản phẩm và trên phiếu mua hàng của bạn. Thông thường linh kiện máy tính có thời gian bảo hành từ 12 - 36 tháng."
    },
    {
      q: "Sản phẩm mua về bị lỗi tôi phải làm gì?",
      a: "Nếu sản phẩm phát sinh lỗi trong 7 ngày đầu, quý khách vui lòng liên hệ ngay với CSKH của Tuny qua số điện thoại 0392868631 để được đổi mới sản phẩm miễn phí. Sau 7 ngày, sản phẩm sẽ được chuyển sang chế độ bảo hành sửa chữa/thay thế của hãng."
    },
    {
      q: "Shop có hỗ trợ build PC theo yêu cầu không?",
      a: "Có, Tuny có đội ngũ kỹ thuật viên chuyên nghiệp hỗ trợ tư vấn và lắp ráp PC theo đúng nhu cầu sử dụng của bạn (học tập, làm việc văn phòng, đồ họa, chơi game) hoàn toàn miễn phí công lắp ráp."
    }
  ];

  return (
    <div style={{ width: '100%', background: '#efefef', padding: '30px 0', minHeight: 'calc(100vh - 440px)' }}>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#9255FD', marginBottom: '24px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          Câu hỏi thường gặp (FAQ)
        </h1>
        
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
          <p style={{ marginBottom: '30px' }}>
            Dưới đây là tổng hợp các câu hỏi thường gặp từ phía khách hàng khi mua sắm tại <strong>Tuny Shop</strong>. Nếu bạn có câu hỏi khác, đừng ngần ngại liên hệ trực tiếp với chúng tôi để được giải đáp nhanh nhất.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #9255FD' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1a1a2e', fontSize: '18px', fontWeight: 700 }}>
                  ❓ {faq.q}
                </h3>
                <p style={{ margin: 0, color: '#555', fontSize: '15px' }}>
                  💡 {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', padding: '20px', background: '#f9f6ff', borderRadius: '8px', border: '1px dashed #9255FD', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 600, color: '#1a1a2e' }}>Bạn vẫn chưa tìm được câu trả lời mong muốn?</p>
            <p style={{ margin: 0 }}>📞 Gọi ngay cho chúng tôi qua hotline: <strong>0392868631</strong> để được tư vấn trực tiếp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
