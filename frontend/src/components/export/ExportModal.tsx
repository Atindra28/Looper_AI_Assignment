import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { TransactionFilters, ExportField } from '../../types';
import { transactionsService } from '../../services/transactions.service';
import { downloadBlob, getExportFilename } from '../../utils/downloadBlob';
import { AlertChip, useAlert } from '../common/AlertChip';
import { COLORS } from '../../theme/theme';

interface ExportField_Config {
  key: ExportField;
  label: string;
  defaultChecked: boolean;
}

const EXPORT_FIELDS: ExportField_Config[] = [
  { key: 'id', label: 'ID', defaultChecked: false },
  { key: 'date', label: 'Date', defaultChecked: true },
  { key: 'amount', label: 'Amount', defaultChecked: true },
  { key: 'category', label: 'Category', defaultChecked: true },
  { key: 'status', label: 'Status', defaultChecked: true },
  { key: 'userName', label: 'User Name', defaultChecked: true },
  { key: 'user_id', label: 'User ID', defaultChecked: false },
  { key: 'user_profile', label: 'User Profile URL', defaultChecked: false },
];

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  filters: TransactionFilters;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, filters }) => {
  const [selected, setSelected] = useState<Record<ExportField, boolean>>(
    EXPORT_FIELDS.reduce(
      (acc, f) => ({ ...acc, [f.key]: f.defaultChecked }),
      {} as Record<ExportField, boolean>
    )
  );
  const [exporting, setExporting] = useState(false);
  const alert = useAlert();

  const selectedFields = EXPORT_FIELDS.filter((f) => selected[f.key]).map(
    (f) => f.key
  );

  const handleToggle = (key: ExportField) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAll = () => {
    const allSelected = selectedFields.length === EXPORT_FIELDS.length;
    const next = EXPORT_FIELDS.reduce(
      (acc, f) => ({ ...acc, [f.key]: !allSelected }),
      {} as Record<ExportField, boolean>
    );
    setSelected(next);
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert.show('Please select at least one column to export.', 'warning');
      return;
    }

    setExporting(true);
    alert.clear();
    try {
      const blob = await transactionsService.exportCsv(selectedFields, filters);
      downloadBlob(blob, getExportFilename());
      onClose();
    } catch (err) {
      alert.show('CSV export failed. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const allSelected = selectedFields.length === EXPORT_FIELDS.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Export CSV
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select columns to include in the export
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: COLORS.textSecondary }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {alert.message && (
          <AlertChip
            message={alert.message}
            severity={alert.severity}
            onClose={alert.clear}
            inline
          />
        )}

        {/* Select all */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {selectedFields.length} of {EXPORT_FIELDS.length} columns selected
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={handleSelectAll}
            sx={{ color: COLORS.green, fontWeight: 600, p: 0, fontSize: '0.75rem' }}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </Box>

        <FormGroup>
          {EXPORT_FIELDS.map((field) => (
            <FormControlLabel
              key={field.key}
              control={
                <Checkbox
                  checked={selected[field.key]}
                  onChange={() => handleToggle(field.key)}
                  size="small"
                  sx={{
                    color: COLORS.borderLight,
                    '&.Mui-checked': { color: COLORS.green },
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.primary">
                  {field.label}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
          ))}
        </FormGroup>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            backgroundColor: COLORS.bgSurface,
            borderRadius: '8px',
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            The export will include all transactions matching your current filters.
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={exporting} sx={{ flex: 1 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={exporting || selectedFields.length === 0}
          startIcon={
            exporting ? (
              <CircularProgress size={16} sx={{ color: '#000' }} />
            ) : (
              <FileDownloadRoundedIcon />
            )
          }
          sx={{ flex: 1 }}
        >
          {exporting ? 'Exporting...' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
