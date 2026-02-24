/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/nullgraph.json`.
 */
export type Nullgraph = {
  "address": "2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK",
  "metadata": {
    "name": "nullgraph",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approveBountySubmission",
      "discriminator": [
        91,
        68,
        193,
        37,
        220,
        33,
        215,
        19
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "bounty"
          ]
        },
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "submission",
          "writable": true
        },
        {
          "name": "nullResult"
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  117,
                  110,
                  116,
                  121,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "bounty"
              }
            ]
          }
        },
        {
          "name": "researcherUsdcAta",
          "writable": true
        },
        {
          "name": "treasuryUsdcAta",
          "writable": true
        },
        {
          "name": "protocolState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    },
    {
      "name": "closeBounty",
      "discriminator": [
        90,
        33,
        205,
        110,
        210,
        22,
        247,
        49
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "bounty"
          ]
        },
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  117,
                  110,
                  116,
                  121,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "bounty"
              }
            ]
          }
        },
        {
          "name": "creatorUsdcAta",
          "writable": true
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    },
    {
      "name": "createBounty",
      "discriminator": [
        122,
        90,
        14,
        143,
        8,
        125,
        200,
        2
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocolState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  117,
                  110,
                  116,
                  121,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "bounty"
              }
            ]
          }
        },
        {
          "name": "creatorUsdcAta",
          "writable": true
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "description",
          "type": {
            "array": [
              "u8",
              256
            ]
          }
        },
        {
          "name": "rewardAmount",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initializeProtocol",
      "discriminator": [
        188,
        233,
        252,
        106,
        134,
        146,
        202,
        91
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocolState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "treasury"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feeBasisPoints",
          "type": "u16"
        }
      ]
    },
    {
      "name": "submitNullResult",
      "discriminator": [
        44,
        109,
        120,
        168,
        14,
        237,
        201,
        105
      ],
      "accounts": [
        {
          "name": "researcher",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocolState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "nullResult",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "hypothesis",
          "type": {
            "array": [
              "u8",
              128
            ]
          }
        },
        {
          "name": "methodology",
          "type": {
            "array": [
              "u8",
              128
            ]
          }
        },
        {
          "name": "expectedOutcome",
          "type": {
            "array": [
              "u8",
              128
            ]
          }
        },
        {
          "name": "actualOutcome",
          "type": {
            "array": [
              "u8",
              128
            ]
          }
        },
        {
          "name": "pValue",
          "type": "u32"
        },
        {
          "name": "sampleSize",
          "type": "u32"
        },
        {
          "name": "dataHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "submitToBounty",
      "discriminator": [
        179,
        37,
        4,
        220,
        255,
        65,
        174,
        8
      ],
      "accounts": [
        {
          "name": "researcher",
          "writable": true,
          "signer": true,
          "relations": [
            "nullResult"
          ]
        },
        {
          "name": "nullResult"
        },
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "submission",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  117,
                  110,
                  116,
                  121,
                  95,
                  115,
                  117,
                  98,
                  109,
                  105,
                  115,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "bounty"
              },
              {
                "kind": "account",
                "path": "nullResult"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bountySubmission",
      "discriminator": [
        4,
        78,
        87,
        200,
        141,
        174,
        149,
        239
      ]
    },
    {
      "name": "nullBounty",
      "discriminator": [
        168,
        131,
        6,
        68,
        37,
        163,
        106,
        188
      ]
    },
    {
      "name": "nullResult",
      "discriminator": [
        27,
        239,
        26,
        48,
        116,
        32,
        219,
        141
      ]
    },
    {
      "name": "protocolState",
      "discriminator": [
        33,
        51,
        173,
        134,
        35,
        140,
        195,
        248
      ]
    }
  ],
  "events": [
    {
      "name": "bountyClosed",
      "discriminator": [
        93,
        75,
        96,
        53,
        212,
        127,
        82,
        120
      ]
    },
    {
      "name": "bountyCreated",
      "discriminator": [
        68,
        252,
        247,
        196,
        154,
        247,
        130,
        49
      ]
    },
    {
      "name": "bountyFulfilled",
      "discriminator": [
        54,
        84,
        52,
        43,
        69,
        202,
        201,
        248
      ]
    },
    {
      "name": "bountySubmissionCreated",
      "discriminator": [
        246,
        193,
        221,
        77,
        238,
        38,
        196,
        60
      ]
    },
    {
      "name": "nullResultSubmitted",
      "discriminator": [
        115,
        247,
        158,
        216,
        26,
        15,
        183,
        71
      ]
    },
    {
      "name": "protocolInitialized",
      "discriminator": [
        173,
        122,
        168,
        254,
        9,
        118,
        76,
        132
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidBountyStatus",
      "msg": "Bounty is not in the expected status"
    },
    {
      "code": 6001,
      "name": "invalidSubmissionStatus",
      "msg": "Submission is not in the expected status"
    },
    {
      "code": 6002,
      "name": "submissionMismatch",
      "msg": "Matched submission mismatch"
    },
    {
      "code": 6003,
      "name": "bountyExpired",
      "msg": "Bounty deadline has passed"
    },
    {
      "code": 6004,
      "name": "invalidRewardAmount",
      "msg": "Reward amount must be > 0"
    },
    {
      "code": 6005,
      "name": "feeOverflow",
      "msg": "Fee calculation overflow"
    }
  ],
  "types": [
    {
      "name": "bountyClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bountyNumber",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "refundedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "bountyCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bountyNumber",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "deadline",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "bountyFulfilled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bountyNumber",
            "type": "u64"
          },
          {
            "name": "specimenNumber",
            "type": "u64"
          },
          {
            "name": "researcher",
            "type": "pubkey"
          },
          {
            "name": "payout",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "bountySubmission",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "researcher",
            "type": "pubkey"
          },
          {
            "name": "nullResult",
            "type": "pubkey"
          },
          {
            "name": "bounty",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "bountySubmissionCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bountyNumber",
            "type": "u64"
          },
          {
            "name": "specimenNumber",
            "type": "u64"
          },
          {
            "name": "researcher",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "nullBounty",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "bountyNumber",
            "type": "u64"
          },
          {
            "name": "description",
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "usdcMint",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "matchedSubmission",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nullResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "researcher",
            "type": "pubkey"
          },
          {
            "name": "specimenNumber",
            "type": "u64"
          },
          {
            "name": "hypothesis",
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          },
          {
            "name": "methodology",
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          },
          {
            "name": "expectedOutcome",
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          },
          {
            "name": "actualOutcome",
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          },
          {
            "name": "pValue",
            "type": "u32"
          },
          {
            "name": "sampleSize",
            "type": "u32"
          },
          {
            "name": "dataHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nullResultSubmitted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "specimenNumber",
            "type": "u64"
          },
          {
            "name": "researcher",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "protocolInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "feeBasisPoints",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "protocolState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "nkaCounter",
            "type": "u64"
          },
          {
            "name": "bountyCounter",
            "type": "u64"
          },
          {
            "name": "feeBasisPoints",
            "type": "u16"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
