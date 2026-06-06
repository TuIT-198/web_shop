import React from 'react';

const ReturnPolicyPage = () => {
  return (
    <div style={{ width: '100%', background: '#efefef', padding: '30px 0', minHeight: 'calc(100vh - 440px)' }}>
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#9255FD', marginBottom: '24px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          Chính sách đổi trả hàng
        </h1>
        
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
          <p style={{ marginBottom: '16px' }}>
            Nhằm đảm bảo tối đa quyền lợi của khách hàng khi mua sắm tại <strong>Tuny Shop</strong>, chúng tôi áp dụng chính sách đổi trả hàng linh hoạt đối với các sản phẩm gặp lỗi từ nhà sản xuất hoặc do giao hàng không đúng mẫu mã yêu cầu.
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            1. Thời gian áp dụng đổi trả
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Khách hàng được quyền yêu cầu đổi mới sản phẩm cùng loại trong vòng <strong>7 ngày đầu tiên</strong> kể từ ngày nhận hàng thành công (dựa theo phiếu bán hàng hoặc thông tin giao nhận vận chuyển).
          </p>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            2. Điều kiện sản phẩm được đổi trả
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Sản phẩm gửi lại đổi trả phải đáp ứng đầy đủ các tiêu chuẩn sau:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Sản phẩm được xác định có lỗi kỹ thuật thuộc về nhà sản xuất.</li>
            <li>Sản phẩm còn đầy đủ hộp, vỏ đựng, xốp chèn, sách hướng dẫn sử dụng và tất cả các phụ kiện đi kèm (nếu có).</li>
            <li>Sản phẩm còn nguyên trạng, không bị trầy xước, móp méo nứt vỡ hoặc dính vết bẩn bám dính lạ.</li>
            <li>Có đầy đủ hóa đơn mua hàng, phiếu bảo hành của Tuny Shop.</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            3. Trường hợp không được áp dụng đổi trả
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Chúng tôi rất tiếc không thể giải quyết đổi trả hàng cho các trường hợp:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Khách hàng muốn đổi sang sản phẩm khác chỉ vì thay đổi nhu cầu cá nhân mà sản phẩm đã mua không có lỗi.</li>
            <li>Sản phẩm bị lỗi hư hỏng do khách hàng sử dụng sai cách, tự ý tháo mở thiết bị gây rách tem bảo hành.</li>
            <li>Hộp sản phẩm hoặc các phụ kiện kèm theo bị mất mát, rách hỏng nặng.</li>
          </ul>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginTop: '30px', marginBottom: '12px' }}>
            4. Chi phí vận chuyển đổi trả
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Nếu lỗi kỹ thuật được xác định chính xác từ phía nhà sản xuất hoặc shop gửi sai loại, <strong>Tuny Shop sẽ chịu 100% chi phí chuyển phát</strong> sản phẩm đổi trả.
          </p>

          <div style={{ marginTop: '40px', padding: '20px', background: '#f9f6ff', borderRadius: '8px', borderLeft: '4px solid #9255FD' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#9255FD', fontWeight: 700 }}>Thông tin hỗ trợ đổi trả</h3>
            <p style={{ margin: '4px 0' }}>📞 <strong>Liên hệ bộ phận CSKH:</strong> 0392868631 (Mr. Tus)</p>
            <p style={{ margin: '4px 0' }}>✉️ <strong>Email hỗ trợ:</strong> support@tuny.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
