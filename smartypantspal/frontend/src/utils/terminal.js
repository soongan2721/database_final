// src/utils/terminal.js

import { useMessage, useDialog, useDialogReactiveList } from 'naive-ui';
import { useRouter } from 'vue-router';

export function useTerminal(customCommands = {}) {
    const dialog = useDialog();
    const message = useMessage();
    const router = useRouter();
    const dialogReactiveList = useDialogReactiveList();
    const commands = {
        '/exit': () => {
            dialog.destroyAll();
        },
        '/list': () => {
            const commandList = Object.keys(commands).join(', ');
            // console.log(commandList);
            message.info(`Available commands: ${commandList}`, { duration: 5e3, showIcon: false });
        },
        ...customCommands, // 合併自定義命令
    };

    const handleKeydown = (event) => {
        if (event.key === '/' && dialogReactiveList.value.length === 0 && router.currentRoute.value.name !== 'question') {
            dialog.warning({
                title: '>_',
                content: () => {
                    return h('input', {
                        type: 'text',
                        placeholder: 'use /exit to close terminal.',
                        onKeydown: (e) => {
                            if (e.key === 'Enter') {
                                const input = e.target.value.trim();
                                const parts = input.split(' ');
                                const command = parts[0];
                                const params = parts.slice(1).join(' ');
                                if (commands[command]) {
                                    commands[command](params);
                                    dialog.destroyAll();
                                } else {
                                    message.warning('Invalid command. Use "/exit" to exit or "/list" to see all commands.');
                                }
                            }
                        },
                        style: { width: '100%' },
                    });
                },
                autoFocus: true,
                closable: false,
                maskClosable: false,
                closeOnEsc: false,
                showIcon: false,
            });
        }
        else if(event.key === 'Escape') {
            dialog.destroyAll();
        }
    };
    // onMounted(() => {
    //   window.addEventListener('keydown', handleKeydown);
    // });
    // onUnmounted(() => {
    //   window.removeEventListener('keydown', handleKeydown);
    // });
    return {
        handleKeydown,
        commands,
    };
}
