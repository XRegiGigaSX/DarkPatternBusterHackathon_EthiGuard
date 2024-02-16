// Import the required components from the Lit Library 
import { css, unsafeCSS } from '../scripts/lit/lit-core.min.js';

/**
 * The object to access the API functions of the browser.
 * @constant
 * @type {{runtime: object, tabs: object, i18n: object}} BrowserAPI
 */
const brw = chrome;

export const sharedStyles = css`
    div {
        margin: 20px auto;
    }

    a:link,
    a:visited {
        color: inherit;
    }

    h2 {
        margin: 0.5em 0;
    }

    * {
        font-family: 'Orbitron', sans-serif;
    }
`;

export const patternLinkStyles = css`
    a {
        text-decoration: none;
        cursor: pointer;
    }

    a:hover {
        text-decoration: underline;
    }
`;

export const actionButtonStyles = css`
    div span {
        color: #217284;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
    }

    div span:hover {
        text-decoration: underline;
    }

    @media (prefers-color-scheme: dark) {
        div {
            color: #33bfde;
        }
    }
`;

export const patternsListStyles = css`
    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin: 10px 0;
    }
`;

// On/Off Flipswitch from https://proto.io/freebies/onoff/
// export const onOffSwitchStyles = css`
//     div {
//         position: relative;
//         width: 90px;
//         -webkit-user-select: none;
//         -moz-user-select: none;
//         -ms-user-select: none;
//     }

//     input {
//         position: absolute;
//         opacity: 0;
//         pointer-events: none;
//     }

//     label {
//         display: block;
//         overflow: hidden;
//         border: 2px solid #000000;
        
//     }

//     input:enabled+label {
//         cursor: pointer;
//     }

//     input:disabled+label {
//         cursor: not-allowed;
//     }

//     .onoffswitch-inner {
//         display: block;
//         width: 200%;
//         margin-left: -100%;
//     }

//     .onoffswitch-inner:before,
//     .onoffswitch-inner:after {
//         display: block;
//         float: left;
//         width: 50%;
//         height: 30px;
//         padding: 0;
//         line-height: 30px;
//         font-size: 14px;
//         color: white;
//         font-family: Trebuchet, Arial, sans-serif;
//         font-weight: bold;
//         box-sizing: border-box;
//     }

//     .onoffswitch-inner:before {
//         content: "${unsafeCSS(brw.i18n.getMessage("buttonOnState"))}";
//         padding-left: 10px;
//         background-color: #34A7C1;
//         color: #FFFFFF;
//     }

//     .onoffswitch-inner:after {
//         content: "${unsafeCSS(brw.i18n.getMessage("buttonOffState"))}";
//         padding-right: 10px;
//         background-color: #EEEEEE;
//         color: #999999;
//         text-align: right;
//     }

//     .onoffswitch-switch {
//         display: block;
//         width: 18px;
//         margin: 6px;
//         background: black;
//         position: absolute;
//         top: 0;
//         bottom: 0;
//         right: 56px;
//         border: 2px solid #000000;
//         border-radius: 50px;
//     }

//     input:checked+label .onoffswitch-inner {
//         margin-left: 0;
//     }

//     input:checked+label .onoffswitch-switch {
//         right: 0px;
//     }

//     @media (prefers-color-scheme: dark) { 
//         label {
//             border: 2px solid #FFFFFF;
//         }
    
//         .onoffswitch-inner:before {
//             background-color: #b6f2e7;
//             color: #000000;
//         }
//     }
// `;

// Import the required components from the Lit Library 

export const onOffSwitchStyles = css`
    div {
        position: relative;
        width: 120px;
        transform: skew(-20deg);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    label {
        display: block;
        overflow: hidden;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        border-radius: 8px;
    }

    input:enabled+label {
        cursor: pointer;
    }

    input:disabled+label {
        cursor: not-allowed;
    }

    .onoffswitch-inner {
        display: block;
        width: 200%;
        margin-left: -100%;
        background: #0a0a0a;
        transform: skew(-20deg);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
    }

    .onoffswitch-inner:before,
    .onoffswitch-inner:after {
        display: block;
        float: left;
        width: 50%;
        height: 40px;
        padding: 0;
        line-height: 40px;
        font-size: 14px;
        color: white;
        font-family: 'Orbitron', sans-serif;
        font-weight: bold;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        overflow: hidden;
    }

    .onoffswitch-inner:before {
        content: "${unsafeCSS(brw.i18n.getMessage("buttonOnState"))}";
        padding-left: 30px;
        background-color: #28a745;
        color: #FFFFFF;
        transform: translateX(-10px);
        border-bottom-right-radius: 100px;
        text-align: left;
    }

    .onoffswitch-inner:after {
        content: "${unsafeCSS(brw.i18n.getMessage("buttonOffState"))}";
        padding-right: 30px;
        background-color: #dc3545;
        color: #FFFFFF;
        transform: translateX(10px);
        border-top-left-radius: 100px;
        text-align: right;
    }

    .onoffswitch-switch {
        display: block;
        width: 40px;
        height: 40px;
        background: #343a40;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 80px;
        border: 2px solid #000000;
        z-index: 2;
        transition: right 0.3s ease-in-out;
        transform: skew(-20deg);
    }

    input:checked+label .onoffswitch-inner {
        margin-left: 0;
    }

    input:checked+label .onoffswitch-switch {
        right: 0px;
    }

    .button-div2 {
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .cyborg-container {
        text-align: center;
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-family: 'Orbitron', sans-serif;
    }

    .cyborg-button,
    .cyborg-checkbox {
        border: none;
        border-radius: 0 !important;
        padding: 10px 20px;
        font-size: 16px;
        color: #b6b6b6;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
    }

    .cyborg-button {
        background-color: cyan;
        display: inline-block;
        margin-bottom: 20px;
        scale: 0.7;
        color: black;
    }

    .cyborg-checkbox {
        display: none;
        font-family: 'Orbitron', sans-serif;
    }

    .cyborg-label {
        background-color: #34dc34;
        border-radius: 0 !important;
        padding: 10px 20px;
        font-size: 14px;
        color: black;
        cursor: pointer;
        display: inline-block;
        transform: translateY(-12px);
        font-family: 'Orbitron', sans-serif;
        scale: 0.8;
        
    }

    .cyborg-checkbox:checked + .cyborg-label {
        background-color: #dc3545;
        font-family: 'Orbitron', sans-serif;
    }


    @media (prefers-color-scheme: dark) { 
        
        .onoffswitch-inner:before {
            background-color: #218838;
            color: #FFFFFF;
        }

        .onoffswitch-inner:after {
            background-color: #c82333;
            color: #FFFFFF;
        }

        .onoffswitch-switch {
            background: #343a40;
            border: 2px solid #000000;
        }
    }
`;
