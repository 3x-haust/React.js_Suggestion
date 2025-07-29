import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -${({ theme }) => theme.spacing.sm};
`;

interface ColProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

export const Col = styled.div<ColProps>`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  flex: 1;

  ${({ xs }) => xs && `flex: 0 0 ${(xs / 12) * 100}%;`}

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    ${({ sm }) => sm && `flex: 0 0 ${(sm / 12) * 100}%;`}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    ${({ md }) => md && `flex: 0 0 ${(md / 12) * 100}%;`}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    ${({ lg }) => lg && `flex: 0 0 ${(lg / 12) * 100}%;`}
  }
`;

export const Flex = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'stretch' }) => align};
  gap: ${({ gap = '0' }) => gap};
`;
