import nodemailer from 'nodemailer';

// Cấu hình Gmail SMTP (lấy env vars khi transporter được tạo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 📧 Send OTP Email
export const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Verification Code',
      html: `
        <h2>OTP Verification Code</h2>
        <p>Your OTP code is valid for 10 minutes.</p>
        <h1 style="color: #9d5243; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
        <p>Do not share this code with anyone.</p>
        <hr>
        <p style="color: #999; font-size: 12px;">© 2026 Modern Heritage</p>
      `,
    });
    console.log('📧 OTP sent to:', email);
    console.log('🔐 OTP Code:', otp); // DEBUG: Print OTP to console
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    throw error;
  }
};

// 📧 Send Password Reset Email
export const sendPasswordResetEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Reset Your Password</h2>
        <p>Your OTP code is valid for 10 minutes.</p>
        <h1 style="color: #9d5243; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #999; font-size: 12px;">© 2026 Modern Heritage</p>
      `,
    });
    console.log('📧 Password reset sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending reset email:', error.message);
    throw error;
  }
};

// 📧 Send Welcome Email
export const sendWelcomeEmail = async (email, firstName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Modern Heritage',
      html: `
        <h2>Welcome, ${firstName}!</h2>
        <p>Your account has been successfully created.</p>
        <p>You can now login to start your heritage journey.</p>
        <hr>
        <p style="color: #999; font-size: 12px;">© 2026 Modern Heritage</p>
      `,
    });
    console.log('📧 Welcome email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    throw error;
  }
};

// 📧 Send Email Verification Link with OTP
export const sendVerifyEmailLink = async (
  email,
  otp,
  frontendUrl = 'http://localhost:5175'
) => {
  try {
    const verifyLink = `${frontendUrl}/verify-email?email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Xác nhận Email - Tài khoản Modern Heritage',
      html: `
        <div style="font-family: Quicksand, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #9d5243 0%, #7a3f32 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Xác nhận Email của bạn</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Cảm ơn bạn đã đăng ký tài khoản. Vui lòng xác nhận email của bạn bằng cách nhập mã OTP dưới đây.
            </p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Mã OTP của bạn:</p>
              <h2 style="color: #9d5243; font-size: 36px; letter-spacing: 4px; margin: 10px 0; font-family: monospace;">${otp}</h2>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">Mã OTP có hiệu lực trong 10 phút</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #9d5243 0%, #7a3f32 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Xác nhận Email
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              Hoặc copy link dưới đây vào trình duyệt:
            </p>
            <p style="color: #9d5243; font-size: 12px; word-break: break-all; background: #f9f9f9; padding: 10px; border-radius: 4px;">
              ${verifyLink}
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px;">
              Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
            </p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2026 Modern Heritage. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
    console.log('📧 Verify email link sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending verify email:', error.message);
    throw error;
  }
};
