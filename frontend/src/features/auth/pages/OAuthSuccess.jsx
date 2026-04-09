import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { LoadingSpinner } from '@/shared/components/common';
import axiosInstance from '@/services/axiosInstance';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error(`OAuth login failed: ${error}`);
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
      return;
    }

    if (token) {
      try {
        
        localStorage.setItem('token', token);

        
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;

        
        axiosInstance
          .get('/api/v1/users/profile')
          .then((response) => {
            const user = response.data?.data || response.data?.user;

            if (user) {
              
              localStorage.setItem('user', JSON.stringify(user));

              
              setUser(user);

              toast.success('Login successful! Redirecting...');
              setTimeout(() => {
                navigate('/dashboard');
              }, 1500);
            } else {
              throw new Error('Invalid user data received');
            }
          })
          .catch((err) => {
            toast.error('Failed to fetch user profile');
            
            localStorage.removeItem('token');
            setTimeout(() => {
              navigate('/auth/login');
            }, 2000);
          });
      } catch (err) {
        toast.error('Failed to process OAuth response');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      }
    } else {
      toast.error('Invalid OAuth response');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.95rem' }}>
          Đang xử lý đăng nhập...
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
