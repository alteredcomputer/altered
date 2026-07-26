import { type } from "arktype"

//  TODO P0: Convert to Effect Config.

/**
 * @remarks Mirrors `example.env`.
 */
const environmentConfigSchema = type({
    shared: {
        config: {
            env: "string > 0"
        },

        admin: {
            phoneNumber: "string > 0"
        },

        jobs: {
            secret: "string > 0"
        },

        storage: {
            database: {
                url: "string > 0"
            },
            kv: {
                url: "string > 0"
            }
        },

        providers: {
            sendblue: {
                public: "string > 0",
                secret: "string > 0",
                number: "string > 0",
                signing: "string > 0"
            },
            openrouter: {
                secret: "string > 0"
            },
            ngrok: {
                url: "string > 0",
                secret: "string > 0"
            },
            upstash: {
                redis: {
                    url: "string > 0",
                    secret: "string > 0"
                }
            },
            vercel: {
                team: {
                    id: "string > 0"
                },
                secret: "string > 0"
            },
            github: {
                repository: {
                    id: "string > 0"
                }
            }
        }
    }
})

type EnvironmentConfig = typeof environmentConfigSchema.infer

let environmentConfig: EnvironmentConfig | undefined

function assertEnvironmentConfig(): EnvironmentConfig {
    return environmentConfigSchema.assert({
        shared: {
            config: {
                env: process.env.SHARED_CONFIG_ENV
            },

            admin: {
                phoneNumber: process.env.SHARED_ADMIN_PHONE_NUMBER
            },

            jobs: {
                secret: process.env.SHARED_JOBS_SECRET
            },

            storage: {
                database: {
                    url: process.env.SHARED_STORAGE_DATABASE_URL
                },
                kv: {
                    url: process.env.SHARED_STORAGE_KV_URL
                }
            },

            providers: {
                sendblue: {
                    public: process.env.SHARED_PROVIDER_SENDBLUE_PUBLIC,
                    secret: process.env.SHARED_PROVIDER_SENDBLUE_SECRET,
                    number: process.env.SHARED_PROVIDER_SENDBLUE_NUMBER,
                    signing: process.env.SHARED_PROVIDER_SENDBLUE_SIGNING
                },
                openrouter: {
                    secret: process.env.SHARED_PROVIDER_OPENROUTER_SECRET
                },
                ngrok: {
                    url: process.env.SHARED_PROVIDER_NGROK_URL,
                    secret: process.env.SHARED_PROVIDER_NGROK_SECRET
                },
                upstash: {
                    redis: {
                        url: process.env.SHARED_PROVIDER_UPSTASH_REDIS_URL,
                        secret: process.env.SHARED_PROVIDER_UPSTASH_REDIS_SECRET
                    }
                },
                vercel: {
                    team: {
                        id: process.env.SHARED_PROVIDER_VERCEL_TEAM_ID
                    },
                    secret: process.env.SHARED_PROVIDER_VERCEL_SECRET
                },
                github: {
                    repository: {
                        id: process.env.SHARED_PROVIDER_GITHUB_REPOSITORY_ID
                    }
                }
            }
        }
    })
}

function getEnvironmentConfig(): EnvironmentConfig {
    environmentConfig ??= assertEnvironmentConfig()

    return environmentConfig
}

export { assertEnvironmentConfig, type EnvironmentConfig, getEnvironmentConfig }
