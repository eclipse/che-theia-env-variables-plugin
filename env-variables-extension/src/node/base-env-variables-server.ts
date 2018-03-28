/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { inject, injectable } from 'inversify';
import { ILogger } from '@theia/core/lib/common';
import { IBaseEnvVariablesServer, EnvVariable } from '../common/base-env-variables-protocol';

interface ProcessEnv {
    [key: string]: string | undefined;
}

@injectable()
export class BaseEnvVariablesServer implements IBaseEnvVariablesServer {

    private envs: EnvVariable[] = [];

    constructor(@inject(ILogger) protected readonly logger: ILogger) {
        const prEnv: ProcessEnv = process.env;
        const keys = Object.keys(prEnv);
    
        keys.forEach((key: string) => {
            const value = prEnv[key] || '';
            this.envs.push({"name": key, "value": value});
        })
    }

    async getEnvList(): Promise<EnvVariable[]> {
        return Promise.resolve(this.envs);
    }

    async getEnvValueByKey(key: string): Promise<string> {
        let result = '';

        for (var elem of this.envs) {
            if (elem.name === key) {
                result = elem.value;
                break;
            }
        };

        return Promise.resolve(result);
    }

    dispose(): void {
        // noop
    }
}
