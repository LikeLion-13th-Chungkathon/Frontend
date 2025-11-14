import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary"; 
type ButtonSize = "large" | "small";

interface StyledButtonProps {
    variant: ButtonVariant;
    size: ButtonSize;
}

export const Button = styled.button<StyledButtonProps>`
    border: none;
    cursor: pointer;
    color: #fff;
    border-radius: 22px;

    ${({ size }) =>
        size === "small"
        ? css`
            width: 140px;
            height: 44px;
            `
        : css`
            width: 266px;
            height: 44px;
            `}

    ${({ variant, theme }) =>
        variant === "primary"
        ? css`
            background: ${theme.colors.primary}; /* #C78550 */
            `
        : css`
            background: #fff;
            color: ${theme.colors.primary};;
            `}
`;

