%define module  @SHORT_NAME@

Name:       vigilo-%{module}
Summary:    @SUMMARY@
Version:    @VERSION@
Release:    @RELEASE@%{?dist}
Source0:    %{name}-%{version}.tar.gz
URL:        @URL@
Group:      Applications/System
BuildRoot:  %{_tmppath}/%{name}-%{version}-%{release}-build
License:    GPLv2
Buildarch:  noarch

BuildRequires:   python-distribute
BuildRequires:   python-babel
BuildRequires:   python-genshi

Requires:   python-distribute
Requires:   vigilo-common
Requires:   python-genshi
Requires:   python-babel

Provides:   vigilo-themes = %{version}-%{release}


%description
@DESCRIPTION@
This module is part of the Vigilo Project <http://vigilo-nms.com>

%prep
%setup -q

%build

%install
rm -rf $RPM_BUILD_ROOT
make install_pkg \
    DESTDIR=$RPM_BUILD_ROOT \
    PREFIX=%{_prefix} \
    SYSCONFDIR=%{_sysconfdir} \
    PYTHON=%{__python}


%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(644,root,root,755)
%doc COPYING.txt
%{python_sitelib}/*
%lang(C) %{python_sitelib}/vigilo/themes/i18n/*/LC_MESSAGES/*.mo
%lang(C) %{python_sitelib}/vigilo/themes/i18n/*/LC_MESSAGES/*.js


%changelog
* Wed Nov 22 2017 Francois Poirotte <francois.poirotte@c-s.fr>
- Rebuild for RHEL 7
- Improve handling of i18n files

* Mon Feb 08 2010 Aurelien Bompard <aurelien.bompard@c-s.fr>
- initial package
