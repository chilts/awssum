#!/usr/bin/env perl
## ----------------------------------------------------------------------------

use strict;
use warnings;
use Data::Dumper;
use Config::IniFiles;
use Template;

my ($provider, $service, $filename) = @ARGV;

unless ( $provider && $service && $filename ) {
    print qq{Usage: $0 <provider> <service> <filename>\n};
    exit 2;
}

my $cfg = Config::IniFiles->new( -file => $filename );
unless ( $cfg ) {
    print join(qq{\n}, @Config::IniFiles::errors);
    print qq{\n};
    exit 2;
}

my $template = Template->new({
    INCLUDE_PATH => '../../_utils/',
});

for my $section ( $cfg->Sections() ) {
    print qq{Making } . lc($provider) . q{/} . lc($service) . qq{/$section.html ... };
    create_html($cfg, $section);
    print qq{done\n};
}

## ----------------------------------------------------------------------------

sub create_html {
    my ($cfg, $operation) = @_;

    my $vars = {
        Provider       => $provider,
        provider       => lc $provider,
        Service        => $service,
        service        => lc $service,
        operation_name => $operation,
        OperationName  => $cfg->val($operation, 'name'     ),
        tagline        => $cfg->val($operation, 'tagline'  ),
        url            => $cfg->val($operation, 'url'      ),
        examples       => $cfg->val($operation, 'examples' ) || '',
        results        => $cfg->val($operation, 'results'  ) || '',
        errors         => $cfg->val($operation, 'errors'   ) || '',
    };
    print Dumper($vars);

    # output to operation.html
    $template->process(q{skeleton.tt}, $vars, qq{$operation.html});
}

## ----------------------------------------------------------------------------
