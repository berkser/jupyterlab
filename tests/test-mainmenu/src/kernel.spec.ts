// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { expect } from 'chai';

import { CommandRegistry } from '@lumino/commands';

import { Widget } from '@lumino/widgets';

import { WidgetTracker } from '@jupyterlab/apputils';

import { KernelMenu, IKernelMenu } from '@jupyterlab/mainmenu';

import { delegateExecute } from './util';

class Wodget extends Widget {
  state: string;
}

describe('@jupyterlab/mainmenu', () => {
  describe('KernelMenu', () => {
    let commands: CommandRegistry;
    let menu: KernelMenu;
    let tracker: WidgetTracker<Wodget>;
    let wodget: Wodget;

    beforeAll(() => {
      commands = new CommandRegistry();
    });

    beforeEach(() => {
      wodget = new Wodget();
      menu = new KernelMenu({ commands });
      tracker = new WidgetTracker<Wodget>({ namespace: 'wodget' });
      void tracker.add(wodget);
    });

    afterEach(() => {
      menu.dispose();
      tracker.dispose();
      wodget.dispose();
    });

    describe('#constructor()', () => {
      it('should construct a new kernel menu', () => {
        expect(menu).to.be.an.instanceof(KernelMenu);
        expect(menu.menu.title.label).to.equal('Kernel');
      });
    });

    describe('#kernelUsers', () => {
      it('should allow setting of an IKernelUser', () => {
        const user: IKernelMenu.IKernelUser<Wodget> = {
          tracker,
          noun: 'Wodget',
          interruptKernel: widget => {
            widget.state = 'interrupt';
            return Promise.resolve(void 0);
          },
          restartKernel: widget => {
            widget.state = 'restart';
            return Promise.resolve(void 0);
          },
          restartKernelAndClear: widget => {
            widget.state = 'restartAndClear';
            return Promise.resolve(void 0);
          },
          changeKernel: widget => {
            widget.state = 'change';
            return Promise.resolve(void 0);
          },
          shutdownKernel: widget => {
            widget.state = 'shutdown';
            return Promise.resolve(void 0);
          }
        };
        menu.kernelUsers.add(user);
        void delegateExecute(wodget, menu.kernelUsers, 'interruptKernel');
        expect(wodget.state).to.equal('interrupt');
        void delegateExecute(wodget, menu.kernelUsers, 'restartKernel');
        expect(wodget.state).to.equal('restart');
        void delegateExecute(wodget, menu.kernelUsers, 'restartKernelAndClear');
        expect(wodget.state).to.equal('restartAndClear');
        void delegateExecute(wodget, menu.kernelUsers, 'changeKernel');
        expect(wodget.state).to.equal('change');
        void delegateExecute(wodget, menu.kernelUsers, 'shutdownKernel');
        expect(wodget.state).to.equal('shutdown');
      });
    });
  });
});
