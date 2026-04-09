import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './DeleteConfirmDialog.scss';

const DeleteConfirmDialog = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Xác nhận xóa người dùng</h3>
        </div>

        <div className="dialog-body">
          <div className="warning-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <p className="dialog-message">
            Bạn có chắc chắn muốn xóa <strong>{userName}</strong>?
          </p>
          <p className="dialog-subtext">
            Hành động này không thể hoàn tác. Tất cả dữ liệu của người dùng sẽ
            bị xóa vĩnh viễn.
          </p>
        </div>

        <div className="dialog-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy bỏ
          </button>
          <button
            className="btn-delete"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Đang xóa...
              </>
            ) : (
              'Xóa ngay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
