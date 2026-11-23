import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TaskCard from './TaskCard';

const task = {
  _id: '1',
  title: 'Write the report',
  notes: 'Quarterly summary',
  status: 'in-progress',
  priority: 'high',
  dueDate: null,
};

describe('TaskCard', () => {
  it('renders title, notes and priority badge', () => {
    render(
      <TaskCard task={task} onMove={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Write the report')).toBeTruthy();
    expect(screen.getByText('Quarterly summary')).toBeTruthy();
    expect(screen.getByText('high')).toBeTruthy();
  });

  it('calls onEdit when Edit is clicked', () => {
    const onEdit = vi.fn();
    render(
      <TaskCard task={task} onMove={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />
    );
    screen.getByText('Edit').click();
    expect(onEdit).toHaveBeenCalledWith(task);
  });
});
